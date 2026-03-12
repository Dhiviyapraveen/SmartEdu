const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  grade: Number,
  xp: {
    type: Number,
    default: 0
  },
  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);