const express = require("express");
const { saveInterests } =  require("../controllers/profileController.js");
const router = express.Router();

router.post("/save-interests", saveInterests);

module.exports = router;