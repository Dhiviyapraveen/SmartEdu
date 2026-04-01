const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getLeaderboard);

module.exports = router;
