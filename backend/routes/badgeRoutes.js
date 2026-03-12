const express = require("express");
const router = express.Router();
const { getBadges, createBadge } = require("../controllers/badgeController");

router.get("/", getBadges);
router.post("/", createBadge);

module.exports = router;