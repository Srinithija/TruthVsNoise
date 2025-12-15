// src/controllers/voteController.js
const Vote = require("../models/vote");
const Claim = require("../models/Claim");
const { getCredibilityForDomain } = require("../utils/credibilityCalculator");

// POST /api/vote/:claimId
exports.submitVote = async (req, res) => {
  try {
    const { vote } = req.body; // "true" or "false"
    const claimId = req.params.claimId;
    if (!["true", "false"].includes(vote)) return res.status(400).json({ message: "Invalid vote" });

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // prevent multiple votes by same user (simple approach)
    const existing = await Vote.findOne({ claimId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: "You have already voted on this claim" });

    // get domain credibility value (0..1)
    const cred = getCredibilityForDomain(req.user, claim.domain);

    // store vote
    const newVote = await Vote.create({
      claimId,
      userId: req.user._id,
      vote,
      credibilityUsed: Math.round(cred * 100) // store as 0..100 for easy auditing
    });

    // update raw counts + weighted counts on claim
    if (vote === "true") {
      claim.rawVotes.trueVotes += 1;
      claim.weightedVotes.trueWeight += cred;
    } else {
      claim.rawVotes.falseVotes += 1;
      claim.weightedVotes.falseWeight += cred;
    }

    // compute finalTruthScore (0..100)
    const trueW = claim.weightedVotes.trueWeight;
    const falseW = claim.weightedVotes.falseWeight;
    const denom = trueW + falseW;
    claim.finalTruthScore = denom === 0 ? 50 : Math.round((trueW / denom) * 100);

    await claim.save();

    // (optional) emit socket event here if you add real-time

    res.status(201).json({ message: "Vote recorded", vote: newVote, claimSummary: { rawVotes: claim.rawVotes, weightedVotes: claim.weightedVotes, finalTruthScore: claim.finalTruthScore } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/vote/results/:claimId
exports.getResults = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json({ rawVotes: claim.rawVotes, weightedVotes: claim.weightedVotes, finalTruthScore: claim.finalTruthScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
