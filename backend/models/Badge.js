const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String
});

module.exports = mongoose.model("Badge", badgeSchema);