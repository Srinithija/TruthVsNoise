// src/controllers/voteController.js
const Vote = require("../models/vote");
const Claim = require("../models/Claim");
const User = require("../models/user");

const { getCredibilityForDomain } = require("../utils/credibilityCalculator");

// helpers
function computeVerdict(finalTruthScore) {
  if (finalTruthScore >= 60) return "TRUE";
  if (finalTruthScore <= 40) return "FALSE";
  return "CONTESTED";
}

// POST /api/vote/:claimId
exports.submitVote = async (req, res) => {
  try {
    const { vote } = req.body; // "true" | "false" | "unsure"
    const claimId = req.params.claimId;
    if (!["true", "false", "unsure"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote" });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    if (claim.status === "closed") return res.status(400).json({ message: "Voting is closed for this claim" });

    // prevent multiple votes by same user (simple approach)
    const existing = await Vote.findOne({ claimId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: "You have already voted on this claim" });

    // Get fresh user data with all fields to ensure we have domain credibility info
    const fullUser = await User.findById(req.user._id);
    
    console.log("=== VOTE DEBUG INFO ===");
    console.log("User ID:", fullUser._id);
    console.log("User base credibility:", fullUser.baseCredibility);
    console.log("User domain credibility:", fullUser.domainCredibility);
    console.log("Claim domain:", claim.domain);
    
    // get domain credibility value (0..1) for all users
    const weight = getCredibilityForDomain(fullUser, claim.domain);
    
    console.log("Calculated weight:", weight);

    // store vote
    const newVote = await Vote.create({
      claimId,
      userId: req.user._id,
      vote,
      credibilityUsed: Math.round(weight * 100) // store as 0..100 for easy auditing
    });

    console.log("Vote created successfully");

    // Prepare update object using $inc for proper atomic updates
    const updateObj = { $inc: {} };
    
    // Update raw votes
    if (vote === "true") {
      updateObj.$inc["rawVotes.trueVotes"] = 1;
      updateObj.$inc["weightedVotes.trueWeight"] = weight;
      console.log("Adding TRUE vote. Weight:", weight);
    } else if (vote === "false") {
      updateObj.$inc["rawVotes.falseVotes"] = 1;
      updateObj.$inc["weightedVotes.falseWeight"] = weight;
      console.log("Adding FALSE vote. Weight:", weight);
    } else {
      // unsure
      updateObj.$inc["rawVotes.unsureVotes"] = 1;
      updateObj.$inc["weightedVotes.unsureWeight"] = weight;
      console.log("Adding UNSURE vote. Weight:", weight);
    }

    // Update the claim with increments
    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      updateObj,
      { new: true, runValidators: true }
    );

    console.log("Updated claim:", {
      rawVotes: updatedClaim.rawVotes,
      weightedVotes: updatedClaim.weightedVotes
    });

    // Recalculate final truth score based on updated values
    const trueW = updatedClaim.weightedVotes.trueWeight;
    const falseW = updatedClaim.weightedVotes.falseWeight;
    const unsureW = updatedClaim.weightedVotes.unsureWeight || 0;
    const denom = trueW + falseW + unsureW;
    const finalTruthScore = denom === 0 ? 50 : Math.round((trueW / denom) * 100);
    const verdict = computeVerdict(finalTruthScore);

    // Update with final scores
    const finalClaim = await Claim.findByIdAndUpdate(
      claimId,
      {
        finalTruthScore: finalTruthScore,
        verdict: verdict
      },
      { new: true, runValidators: true }
    );

    console.log("Final claim update:", {
      finalTruthScore: finalClaim.finalTruthScore,
      verdict: finalClaim.verdict,
      weightedVotes: finalClaim.weightedVotes
    });

    const response = {
      rawVotes: finalClaim.rawVotes,
      weightedVotes: finalClaim.weightedVotes,
      finalTruthScore: finalClaim.finalTruthScore,
      verdict: finalClaim.verdict,
      weightedTotal: denom
    };

    res.status(201).json({ message: "Vote recorded", vote: newVote, claimSummary: response });
  } catch (err) {
    console.error("=== VOTE SUBMISSION ERROR ===");
    console.error("Error details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vote/results/:claimId
exports.getResults = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    console.log("=== RESULTS RETRIEVAL DEBUG INFO ===");
    console.log("Claim data:", {
      id: claim._id,
      rawVotes: claim.rawVotes,
      weightedVotes: claim.weightedVotes,
      finalTruthScore: claim.finalTruthScore,
      verdict: claim.verdict
    });

    const trueW = claim.weightedVotes.trueWeight;
    const falseW = claim.weightedVotes.falseWeight;
    const unsureW = claim.weightedVotes.unsureWeight || 0;
    const denom = trueW + falseW + unsureW;
    const finalTruthScore = denom === 0 ? 50 : Math.round((trueW / denom) * 100);
    const verdict = computeVerdict(finalTruthScore);

    res.json({
      rawVotes: claim.rawVotes,
      weightedVotes: claim.weightedVotes,
      finalTruthScore,
      verdict,
      weightedTotal: denom
    });
  } catch (err) {
    console.error("=== RESULTS RETRIEVAL ERROR ===");
    console.error("Error details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vote/details/:claimId - New endpoint for detailed voting information
exports.getDetailedVotes = async (req, res) => {
  try {
    const claimId = req.params.claimId;
    
    // Get the claim
    const claim = await Claim.findById(claimId).populate("author", "name email");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // Get all votes for this claim with user details
    const votes = await Vote.find({ claimId: claimId })
      .populate("userId", "name profession domainCredibility baseCredibility isVerified");

    // Organize votes by type
    const trueVotes = votes.filter(vote => vote.vote === "true");
    const falseVotes = votes.filter(vote => vote.vote === "false");
    const unsureVotes = votes.filter(vote => vote.vote === "unsure");

    // Calculate statistics
    const rawStats = {
      true: claim.rawVotes.trueVotes || 0,
      false: claim.rawVotes.falseVotes || 0,
      unsure: claim.rawVotes.unsureVotes || 0,
      total: (claim.rawVotes.trueVotes || 0) + (claim.rawVotes.falseVotes || 0) + (claim.rawVotes.unsureVotes || 0)
    };

    const weightedStats = {
      true: claim.weightedVotes.trueWeight || 0,
      false: claim.weightedVotes.falseWeight || 0,
      unsure: claim.weightedVotes.unsureWeight || 0,
      total: (claim.weightedVotes.trueWeight || 0) + (claim.weightedVotes.falseWeight || 0) + (claim.weightedVotes.unsureWeight || 0)
    };

    // Format detailed voter information
    const formattedVotes = votes.map(vote => ({
      voter: {
        id: vote.userId._id,
        name: vote.userId.name,
        profession: vote.userId.profession,
        isVerified: vote.userId.isVerified,
        baseCredibility: vote.userId.baseCredibility,
        domainCredibility: vote.userId.domainCredibility
      },
      vote: vote.vote,
      credibilityUsed: vote.credibilityUsed,
      timestamp: vote.createdAt
    }));

    res.json({
      claim: {
        id: claim._id,
        title: claim.title,
        description: claim.description,
        domain: claim.domain,
        author: claim.author,
        status: claim.status,
        createdAt: claim.createdAt
      },
      stats: {
        raw: rawStats,
        weighted: weightedStats,
        finalTruthScore: claim.finalTruthScore,
        verdict: claim.verdict
      },
      votes: formattedVotes,
      voteBreakdown: {
        true: trueVotes,
        false: falseVotes,
        unsure: unsureVotes
      }
    });
  } catch (err) {
    console.error("=== DETAILED VOTES ERROR ===");
    console.error("Error details:", err);
    res.status(500).json({ message: "Server error" });
  }
};