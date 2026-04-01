const User =  require("../models/User.js");
const Progress = require("../models/Progress.js");
const Lesson = require("../models/Lesson.js");
const Mission = require("../models/Mission.js");
const mongoose = require("mongoose");

exports.saveInterests = async (req, res) => {

  try {

    const { interests } = req.body;
    const userId = req.user.id;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { interestedSubjects: interests },
      { new: true }
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

    const completedMissions = await Progress.countDocuments({ 
      userId: req.user.id, 
      completed: true 
    });

    // Calculate progress for each interest
    const courseProgress = [];
    if (user.interestedSubjects && user.interestedSubjects.length > 0) {
      for (const topic of user.interestedSubjects) {
        const topicKey = topic.toLowerCase().trim();
        
        // Find lesson for this topic + grade
        const lesson = await Lesson.findOne({ topic: topicKey, grade: user.grade });
        
        if (lesson) {
          const missions = await Mission.find({ lessonId: lesson._id });
          const missionIds = missions.map(m => m._id);
          
          if (missionIds.length > 0) {
            const completedCount = await Progress.countDocuments({
              userId: req.user.id,
              missionId: { $in: missionIds },
              completed: true
            });
            
            courseProgress.push({
              topic: topic, // Original casing
              progress: Math.round((completedCount / missionIds.length) * 100)
            });
          } else {
            courseProgress.push({ topic, progress: 0 });
          }
        } else {
          courseProgress.push({ topic, progress: 0 });
        }
      }
    }

    // Calculate latest wins (5 most recent completions)
    const latestWins = await Progress.find({ userId: req.user.id, completed: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("missionId", "title");

    // Dynamic AI Insight & Recommendation
    let aiInsight = "Consistency is key to mastering complexity!";
    let recommendation = "Cyber Security (Suggested)";
    
    if (user.interestedSubjects && user.interestedSubjects.length > 0) {
      const topInterest = user.interestedSubjects[0].toLowerCase();
      if (topInterest.includes("ai")) {
        aiInsight = "AI is not just about code; it's about solving the unsolvable.";
        recommendation = "Neural Networks (Path Advanced)";
      } else if (topInterest.includes("robot")) {
        aiInsight = "Hardware meets intelligence in the world of Robotics.";
        recommendation = "Swarm Intelligence (Suggested)";
      }
    }

    // New: Calculate Global Rank
    const globalRank = await User.countDocuments({ xp: { $gt: user.xp || 0 } }) + 1;
    
    // New: Calculate Power Tier
    let powerTier = "Bronze Explorer";
    const xp = user.xp || 0;
    if (xp >= 5000) powerTier = "Diamond Elite";
    else if (xp >= 2000) powerTier = "Gold Master";
    else if (xp >= 500) powerTier = "Silver Voyager";

    // New: Calculate Streak (derived from missions)
    const recentMissionCount = await Progress.countDocuments({ 
        userId: req.user.id, 
        completed: true,
        updatedAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const streak = recentMissionCount > 0 ? `${recentMissionCount} Recent Wins` : "Academy Explorer";

    res.json({ 
      success: true, 
      user: {
        ...user.toObject(),
        completedMissions,
        courseProgress,
        latestWins: latestWins.map(w => ({
          title: w.missionId ? w.missionId.title : "Mission Completed",
          date: w.updatedAt
        })),
        aiInsight,
        recommendation,
        globalRank,
        powerTier,
        streak
      } 
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateXP = async (req, res) => {
  try {
    const { xp } = req.body;
    const userId = req.user.id;

    if (typeof xp !== "number" || xp < 0) {
      return res.status(400).json({ success: false, message: "Invalid XP amount" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { xp: xp } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "XP updated successfully", totalXp: user.xp });
  } catch (err) {
    console.error("XP Update Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, grade } = req.body;
    const userId = req.user.id;

    if (!name || !grade) {
      return res.status(400).json({ success: false, message: "Name and Grade are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, grade: parseInt(grade) },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};