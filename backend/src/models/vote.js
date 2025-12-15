const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  vote: { type: String, enum: ["true", "false"], required: true },

  credibilityUsed: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vote", voteSchema);
