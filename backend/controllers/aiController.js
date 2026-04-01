const groq = require("../utils/groqClient.js");
const Lesson = require("../models/Lesson.js");
const User = require("../models/User.js");
const Mission = require("../models/Mission.js");

exports.getOrGenerateLessons = async (req, res) => {
  try {
    const { interests } = req.body;
    const userId = req.user.id;

    if (!userId || !interests || interests.length === 0) {
      return res.status(400).json({ error: "Missing data (userId or interests)" });
    }

    // 1. Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const grade = user.grade;

    let lessons = [];

    for (let topic of interests) {

      const topicKey = topic.toLowerCase().trim();

      // 2. Check DB
      let existing = await Lesson.findOne({
        topic: topicKey,
        grade
      });

      if (existing) {
        console.log(`[DB] Found existing lesson for "${topicKey}" (Grade ${grade})`);
        // If lesson exists, ensure its missions are updated with lessonId
        for (let i = 0; i < existing.subLessons.length; i++) {
          const sub = existing.subLessons[i];
          const missionTitle = sub.title;

          await Mission.findOneAndUpdate(
            { title: missionTitle, lessonId: existing._id },
            {
              title: missionTitle,
              description: `Part of ${topicKey} learning path`,
              xpReward: sub.xp || 50,
              lessonId: existing._id
            },
            { upsert: true, new: true }
          );
        }
        lessons.push(existing);
        continue;
      }

      // 3. Difficulty
      console.log(`[AI] Generating new lesson for "${topicKey}" (Grade ${grade})...`);
      let level = "beginner";
      if (grade >= 8) level = "intermediate";
      if (grade >= 10) level = "advanced";

      // 4. Prompt
      const prompt = `
Generate a structured learning module for "${topic}" for a ${level} student (grade ${grade}).

Return ONLY JSON:

{
  "title": string,
  "subLessons": [
    {
      "title": string,
      "xp": number, // Provide a value between 100 and 500
      "content": [5 paragraphs],
      "quizzes": [
        {
          "q": string,
          "options": [4 options],
          "correct": number
        }
      ]
    }
  ]
}

Rules:
- Exactly 5 subLessons
- Each subLesson:
  - 5 paragraphs
  - 10 quizzes
- No extra text
`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Return clean JSON only" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });

      let text = response.choices[0].message.content;

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("JSON ERROR:", text);
        return res.status(500).json({ error: "Invalid AI response" });
      }

      // 5. Save
      const newLesson = await Lesson.create({
        topic: topicKey,
        grade,
        title: parsed.title,
        subLessons: parsed.subLessons,
      });

      // 6. Register each sub-lesson as a Mission
      for (let i = 0; i < parsed.subLessons.length; i++) {
        const sub = parsed.subLessons[i];
        const missionTitle = sub.title;

        await Mission.findOneAndUpdate(
          { title: missionTitle, lessonId: newLesson._id },
          {
            title: missionTitle,
            description: `Part of ${topicKey} learning path`,
            xpReward: sub.xp || 50,
            lessonId: newLesson._id
          },
          { upsert: true, new: true }
        );
      }

      lessons.push(newLesson);
    }

    res.json({
      success: true,
      lessons
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};