const express = require("express");
const router = express.Router();
const { completeMission } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");

router.post("/complete", protect, completeMission);

module.exports = router;