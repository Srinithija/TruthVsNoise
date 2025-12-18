const mongoose = require("mongoose");

const domainCredibilitySchema = new mongoose.Schema({
  domain: { type: String, required: true },
  score: { type: Number, default: 50 } // default score
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  profession: { type: String, required: true },
  skills: [String],
  experience: Number,

  baseCredibility: { type: Number, default: 30 }, // assigned after evaluation
  domainCredibility: [domainCredibilitySchema], // each domain has its own score

  proofURL: String, // uploaded certificate / ID / license
  isVerified: { type: Boolean, default: false }, // admin verifies user

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
