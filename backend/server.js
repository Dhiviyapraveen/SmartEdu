const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/missions", require("./routes/missionRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/badges", require("./routes/badgeRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});