const Mission = require("../models/Mission");

exports.getMissions = async (req, res) => {
  const missions = await Mission.find({ courseId: req.params.courseId });
  res.json(missions);
};

exports.createMission = async (req, res) => {
  const { title, description, courseId, xpReward } = req.body;

  const mission = await Mission.create({
    title,
    description,
    courseId,
    xpReward
  });

  res.json(mission);
};