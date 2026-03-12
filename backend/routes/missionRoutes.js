const express = require("express");
const router = express.Router();
const { getMissions, createMission } = require("../controllers/missionController");

router.get("/:courseId", getMissions);
router.post("/", createMission);

module.exports = router;