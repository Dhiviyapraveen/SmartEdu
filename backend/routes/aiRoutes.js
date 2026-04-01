const express = require("express");
const { getOrGenerateLessons } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/lessons", protect, getOrGenerateLessons);

module.exports = router;