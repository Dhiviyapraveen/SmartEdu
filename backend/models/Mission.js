const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  title: String,
  description: String,
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  },
  xpReward: Number
});

module.exports = mongoose.model("Mission", missionSchema);