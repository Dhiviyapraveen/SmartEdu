const express = require("express");
const { saveInterests, getProfile, updateProfile, updateXP } =  require("../controllers/profileController.js");
const router = express.Router();
const auth = require("../middleware/authMiddleware.js");

router.get("/", auth, getProfile);
router.post("/save-interests", auth, saveInterests);
router.put("/update", auth, updateProfile);
router.post("/update-xp", auth, updateXP);

module.exports = router;