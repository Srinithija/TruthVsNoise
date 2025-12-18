const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔑 Check role from token
    if (decoded.type === "admin") {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      req.admin = admin;
    } else {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
