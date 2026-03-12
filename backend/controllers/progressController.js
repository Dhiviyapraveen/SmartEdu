const Progress = require("../models/Progress");
const Mission = require("../models/Mission");
const User = require("../models/User");

exports.completeMission = async (req, res) => {
  const { missionId } = req.body;

  const mission = await Mission.findById(missionId);

  const progress = await Progress.create({
    userId: req.user,
    missionId,
    completed: true
  });

  await User.findByIdAndUpdate(req.user, {
    $inc: { xp: mission.xpReward }
  });

  res.json({ message: "Mission completed", xp: mission.xpReward });
};