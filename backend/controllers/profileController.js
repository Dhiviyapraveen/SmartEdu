const User =  require("../models/User.js");

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