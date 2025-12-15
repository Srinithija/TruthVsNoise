// src/controllers/adminController.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔑 IMPORTANT CHANGE IS HERE
    res.json({
      token,
      role: "admin"
    });

  } catch (err) {
    res.status(500).json({ message: "Admin login failed" });
  }
};

// GET /api/admin/verifications
exports.listPendingVerifications = async (req, res) => {
  try {
    const pending = await User.find({ isVerified: false }).select("name email profession proofURL createdAt baseCredibility");
    res.json({ pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/admin/verify-user/:id
exports.verifyUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { approved, domainCredibility = [], baseCredibility } = req.body; // admin can set domain scores & base
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (approved) {
      user.isVerified = true;
      if (baseCredibility !== undefined) user.baseCredibility = baseCredibility; // e.g., 70
      if (Array.isArray(domainCredibility) && domainCredibility.length) {
        user.domainCredibility = domainCredibility; // [{domain: 'Health', score: 90}, ...]
      }
      await user.save();
      return res.json({ message: "User verified", user });
    } else {
      // reject verification
      user.isVerified = false;
      await user.save();
      return res.json({ message: "User verification rejected", user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
