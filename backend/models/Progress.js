const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  missionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mission"
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Progress", progressSchema);