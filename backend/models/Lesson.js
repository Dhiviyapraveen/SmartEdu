const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  q: String,
  options: [String],
  correct: Number,
});

const subLessonSchema = new mongoose.Schema({
  title: String,
  xp: Number,
  content: [String],
  quizzes: [quizSchema],
});

const lessonSchema = new mongoose.Schema({
  topic: String,
  title: String,
  grade: Number,
  subLessons: [subLessonSchema],
}, { timestamps: true });

// unique per topic + grade
lessonSchema.index({ topic: 1, grade: 1 }, { unique: true });

module.exports = mongoose.model("Lesson", lessonSchema);