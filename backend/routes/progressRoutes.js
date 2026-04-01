const express = require("express");
const router = express.Router();
const { completeMission, completeAISubLesson, getAIProgress } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");

router.post("/complete", protect, completeMission);
router.post("/complete-ai", protect, completeAISubLesson);
router.get("/ai-status", protect, getAIProgress);

module.exports = router;