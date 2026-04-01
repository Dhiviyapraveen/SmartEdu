const Mission = require("../models/Mission");

exports.getMissions = async (req, res) => {
  const missions = await Mission.find({ lessonId: req.params.lessonId });
  res.json(missions);
};

exports.createMission = async (req, res) => {
  const { title, description, lessonId, xpReward } = req.body;

  const mission = await Mission.create({
    title,
    description,
    lessonId,
    xpReward
  });

  res.json(mission);
};