// src/routes/userRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMe, updateProfile, updateDomainCredibility, getCredibility } = require("../controllers/userController");

router.get("/me", auth, getMe);
router.put("/update", auth, updateProfile);
router.put("/update-domain-credibility", auth, updateDomainCredibility);
router.get("/credibility/:id", getCredibility);

module.exports = router;