// src/routes/voteRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { submitVote, getResults } = require("../controllers/voteController");

router.post("/:claimId", auth, submitVote);
router.get("/results/:claimId", getResults);

module.exports = router;
