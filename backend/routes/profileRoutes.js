const express = require("express");
const { saveInterests, getProfile } =  require("../controllers/profileController.js");
const router = express.Router();
const auth = require("../middleware/authMiddleware.js");

router.get("/", auth, getProfile);
router.post("/save-interests", saveInterests);

module.exports = router;