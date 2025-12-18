// src/routes/voteRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { submitVote, getResults, getDetailedVotes } = require("../controllers/voteController");

router.post("/:claimId", auth, submitVote);
router.get("/results/:claimId", getResults);
router.get("/details/:claimId", getDetailedVotes);
module.exports = router;
