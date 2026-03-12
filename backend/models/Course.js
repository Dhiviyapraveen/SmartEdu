const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  level: Number
});

module.exports = mongoose.model("Course", courseSchema);