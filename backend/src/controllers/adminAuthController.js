const Admin = require("../models/admin");
const bcrypt = require("bcrypt"); // Changed from bcryptjs to bcrypt
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
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
   res.json({
    token,
    role: "admin",
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};