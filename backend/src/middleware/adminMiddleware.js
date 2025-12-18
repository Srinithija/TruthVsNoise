module.exports = async (req, res, next) => {
  try {
    // assumes authMiddleware has already run and set req.admin for admin tokens
    if (!req.admin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
