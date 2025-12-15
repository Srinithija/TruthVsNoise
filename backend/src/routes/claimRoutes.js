// src/routes/claimRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createClaim, listClaims, getClaim } = require("../controllers/claimController");

router.post("/", auth, createClaim);
router.get("/", listClaims);
router.get("/:id", getClaim);

module.exports = router;
