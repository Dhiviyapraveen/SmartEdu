const express = require("express");
const router = express.Router();
const { getMissions, createMission } = require("../controllers/missionController");

router.get("/:lessonId", getMissions);
router.post("/", createMission);

module.exports = router;