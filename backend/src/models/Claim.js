const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  attachments: [String],  // Proof, image, references

  rawVotes: {
    trueVotes: { type: Number, default: 0 },
    falseVotes: { type: Number, default: 0 }
  },

  weightedVotes: {
    trueWeight: { type: Number, default: 0 },
    falseWeight: { type: Number, default: 0 }
  },

  finalTruthScore: { type: Number, default: 0 },  // 0 - 100 %

  status: { type: String, default: "open", enum: ["open", "closed"] },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Claim", claimSchema);
