const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch top 50 users sorted by XP descending
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(50)
      .select("name xp grade badges"); // Only non-sensitive data

    // Optional: Find current user's rank
    const allUsers = await User.find().sort({ xp: -1 });
    const userRank = allUsers.findIndex(u => u._id.toString() === req.user.id) + 1;

    res.json({
      success: true,
      leaderboard: topUsers,
      userRank: userRank > 0 ? userRank : "Unranked",
      totalParticipants: allUsers.length
    });
  } catch (err) {
    console.error("Leaderboard Fetch Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
