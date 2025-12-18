const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  vote: { type: String, enum: ["true", "false", "unsure"], required: true },

  credibilityUsed: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Vote || mongoose.model("Vote", voteSchema);
