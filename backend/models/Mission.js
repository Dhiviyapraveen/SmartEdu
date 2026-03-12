const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  title: String,
  description: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  xpReward: Number
});

module.exports = mongoose.model("Mission", missionSchema);