const User =  require("../models/User.js");
const mongoose = require("mongoose");

exports.saveInterests = async (req, res) => {

  try {

    const { userId, interests } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { interestedSubjects: interests },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Interests saved successfully",
      user
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Server error"
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};