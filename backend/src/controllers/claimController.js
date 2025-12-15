// src/controllers/claimController.js
const Claim = require("../models/Claim");
const Vote = require("../models/vote");

// POST /api/claims
exports.createClaim = async (req, res) => {
  try {
    const { title, description, domain, attachments = [] } = req.body;
    if (!title || !description || !domain) return res.status(400).json({ message: "Missing fields" });

    const newClaim = await Claim.create({
      title,
      description,
      domain,
      author: req.user._id,
      attachments
    });

    res.status(201).json({ message: "Claim submitted", claim: newClaim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/claims (paginated)
exports.listClaims = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const claims = await Claim.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("author", "name baseCredibility domainCredibility");
    res.json({ claims, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/claims/:id
exports.getClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("author", "name");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    // fetch votes breakdown if needed
    const votes = await Vote.find({ claimId: claim._id }).populate("userId", "name");
    res.json({ claim, votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
