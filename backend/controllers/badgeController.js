const Badge = require("../models/Badge");

exports.getBadges = async (req, res) => {
  const badges = await Badge.find();
  res.json(badges);
};

exports.createBadge = async (req, res) => {
  const { name, description, icon } = req.body;

  const badge = await Badge.create({
    name,
    description,
    icon
  });

  res.json(badge);
};