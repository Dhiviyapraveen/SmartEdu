const Course = require("../models/Course");

exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.createCourse = async (req, res) => {
  const { title, description, level } = req.body;

  const course = await Course.create({
    title,
    description,
    level
  });

  res.json(course);
};