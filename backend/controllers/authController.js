const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {

  try {

    const { name, email, password, grade } = req.body;

    // validation
    if (!name || !email || !password || !grade) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
      grade
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        grade: user.grade
      },
      token: generateToken(user)
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          grade: user.grade
        },
        token: generateToken(user)
      });

    } else {

      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });

    }

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};