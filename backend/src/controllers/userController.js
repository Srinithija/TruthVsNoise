// src/controllers/userController.js
const User = require("../models/user");

// get current user profile
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// update profile (basic fields)
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "profession", "skills", "experience", "proofURL"];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    res.json({ message: "Profile updated", user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// optional: get credibility for a user (public)
exports.getCredibility = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("baseCredibility domainCredibility isVerified name");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
