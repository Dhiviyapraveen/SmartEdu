const Progress = require("../models/Progress");
const Mission = require("../models/Mission");
const User = require("../models/User");
const Lesson = require("../models/Lesson");

exports.completeMission = async (req, res) => {
  try {
    const { missionId, status } = req.body;
    const userId = req.user.id;

    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ success: false, message: "Mission not found" });
    }

    // Check if already completed
    let progress = await Progress.findOne({ userId, missionId });
    if (progress && progress.completed) {
      return res.json({ success: true, message: "Mission already completed", xp: 0 });
    }

    if (!progress) {
      progress = await Progress.create({
        userId,
        missionId,
        completed: status === "completed" || true
      });
    } else {
      progress.completed = true;
      await progress.save();
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $inc: { xp: mission.xpReward || 50 }
    }, { new: true });

    res.json({ success: true, message: "Mission completed", xp: mission.xpReward || 50, totalXp: updatedUser.xp });
  } catch (err) {
    console.error("Complete Mission Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.completeAISubLesson = async (req, res) => {
  try {
    const { topic, subLessonIndex, xp } = req.body;
    const userId = req.user.id;

    if (!topic || subLessonIndex === undefined) {
      return res.status(400).json({ success: false, message: "Missing topic or index" });
    }

    const subTitle = `Part ${subLessonIndex + 1}`; // Better fallback
    const missionTitle = `AI: ${topic} - ${subTitle}`;
    console.log(`[DEBUG] AI Mission Sync: ${missionTitle}, performance XP: ${xp}`);
    
    // 1. Find or create the mission
    let mission = await Mission.findOne({ title: missionTitle });
    if (!mission) {
      mission = await Mission.create({
        title: missionTitle,
        description: `Completed part ${subLessonIndex + 1} of ${topic} learning path.`,
        xpReward: xp || 50
      });
    }

    // 2. Check for existing progress
    let progress = await Progress.findOne({ userId, missionId: mission._id });
    if (progress && progress.completed) {
      console.log(`[DEBUG] Mission already completed: ${missionTitle}`);
      return res.json({ success: true, message: "Already completed", alreadyDone: true });
    }

    // 3. Create progress
    if (!progress) {
      progress = await Progress.create({
        userId,
        missionId: mission._id,
        completed: true
      });
    } else {
      progress.completed = true;
      await progress.save();
    }

    // 4. Update User XP - use the best of (Mission Base XP or Performance XP)
    const xpToAward = Math.max(mission.xpReward || 0, xp || 0);
    console.log(`[DEBUG] Awarding ${xpToAward} XP to user: ${userId}`);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $inc: { xp: xpToAward }
    }, { new: true });

    res.json({ 
      success: true, 
      message: "Progress saved", 
      xp: xpToAward,
      totalXp: updatedUser.xp 
    });
  } catch (err) {
    console.error("AI Progress Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAIProgress = async (req, res) => {
  try {
    const { topic, lessonId } = req.query; // Support both for flexibility
    const userId = req.user.id;

    let lesson;
    if (lessonId) {
      lesson = await Lesson.findById(lessonId);
    } else if (topic) {
      const user = await User.findById(userId);
      lesson = await Lesson.findOne({ 
        topic: topic.toLowerCase().trim(),
        grade: user ? user.grade : undefined
      });
    }

    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    // 2. Find missions linked to this lesson
    let missions = await Mission.find({ lessonId: lesson._id });

    if (missions.length === 0) {
       // Create placeholders if none found (fallback)
       for (let i = 0; i < lesson.subLessons.length; i++) {
        const sub = lesson.subLessons[i];
        await Mission.findOneAndUpdate(
          { title: sub.title, lessonId: lesson._id },
          { 
            title: sub.title,
            description: `Part of ${lesson.topic} learning path`,
            xpReward: sub.xp || 50,
            lessonId: lesson._id
          },
          { upsert: true }
        );
      }
      missions = await Mission.find({ lessonId: lesson._id });
    }

    const missionIds = missions.map(m => m._id);

    const progressEntries = await Progress.find({
      userId,
      missionId: { $in: missionIds },
      completed: true
    }).populate("missionId");

    // Map to indices by matching mission titles with the lesson's sub-lesson titles
    // This ensures consistent ordering regardless of DB fetch order.
    const completedIndices = progressEntries.map(p => {
       const title = p.missionId.title;
       return lesson.subLessons.findIndex(sub => sub.title === title);
    }).filter(index => index !== -1);

    res.json({ success: true, completedIndices });
  } catch (err) {
    console.error("Fetch AI Progress Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};