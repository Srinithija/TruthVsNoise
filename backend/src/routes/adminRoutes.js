const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const { adminLogin } = require("../controllers/adminAuthController");
const {
  listPendingVerifications,
  verifyUser
} = require("../controllers/adminController");

// Admin login
router.post("/login", adminLogin);

// Admin protected routes
router.get("/verifications", auth, admin, listPendingVerifications);
router.put("/verify-user/:id", auth, admin, verifyUser);

module.exports = router;
