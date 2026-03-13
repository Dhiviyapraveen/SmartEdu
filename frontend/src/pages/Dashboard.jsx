import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaBrain,
  FaUserGraduate,
  FaBars,
  FaHome,
  FaRocket,
  FaMedal,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove saved login data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to home page
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">

      {/* ---------------- Sidebar ---------------- */}
      <div
        className={`bg-gray-800 shadow-lg transition-all duration-300 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className={`text-xl font-bold text-purple-400 ${!open && "hidden"}`}>
            SmartEdu
          </h1>
          <FaBars
            className="cursor-pointer text-gray-400"
            onClick={() => setOpen(!open)}
          />
        </div>

        <nav className="mt-6 space-y-4">
          <SidebarItem icon={<FaHome />} text="Dashboard" open={open} />
          <SidebarItem icon={<FaBrain />} text="AI Missions" open={open} />
          <SidebarItem icon={<FaRobot />} text="Robotics" open={open} />
          <SidebarItem icon={<FaRocket />} text="Drone Lab" open={open} />
          <SidebarItem icon={<FaMedal />} text="Achievements" open={open} />
          <SidebarItem icon={<FaUserGraduate />} text="Profile" open={open} />
        </nav>
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="flex-1 flex flex-col">

        {/* Top Header */}
        <header className="flex justify-between items-center bg-gray-800 px-8 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Student Dashboard</h2>

          <div className="flex items-center space-x-6">

            <span className="text-gray-400">Welcome, Student</span>
            <FaUserCircle size={30} />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 overflow-y-auto">

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">

            <Card
              title="Missions Completed"
              value="12"
              icon="🚀"
              color="bg-purple-700"
            />

            <Card
              title="Current Level"
              value="Level 3"
              icon="⭐"
              color="bg-blue-700"
            />

            <Card
              title="Badges Earned"
              value="5"
              icon="🏅"
              color="bg-green-700"
            />

          </div>

          {/* Learning Progress */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Learning Progress</h3>

            <ProgressBar label="AI Basics" progress="70" />
            <ProgressBar label="Robotics Fundamentals" progress="40" />
            <ProgressBar label="Drone Navigation" progress="20" />
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>

            <ul className="space-y-3 text-gray-400">
              <li>✅ Completed AI Introduction Mission</li>
              <li>🤖 Started Robotics Basics</li>
              <li>🏅 Earned "AI Explorer" Badge</li>
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, open }) {
  return (
    <div className="flex items-center space-x-4 px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
      <span className="text-lg">{icon}</span>
      {open && <span>{text}</span>}
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-200">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function ProgressBar({ label, progress }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-purple-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}