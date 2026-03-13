import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  const missions = [
    { id: 1, title: "Intro AI", icon: "🧠", color: "bg-green-400" },
    { id: 2, title: "Robotics Basics", icon: "🤖", color: "bg-blue-400" },
    { id: 3, title: "Drone Adventure", icon: "🛸", color: "bg-pink-400" },
    { id: 4, title: "AI Mini Project", icon: "💡", color: "bg-purple-400" },
  ];

  const features = [
    { title: "AI Concepts", icon: "🧠", desc: "Interactive AI missions to explore concepts through hands-on challenges.", color: "bg-green-800" },
    { title: "Robotics", icon: "🤖", desc: "Build logic for robots and control them in fun simulated missions.", color: "bg-blue-800" },
    { title: "Drone Missions", icon: "🛸", desc: "Learn drone navigation and control while completing exciting tasks.", color: "bg-pink-800" },
  ];

  return (
    <div className="font-sans text-gray-200 bg-gray-900">
      {/* ---------------------- Navbar ---------------------- */}
      <nav className="flex justify-between items-center py-6 px-10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <h1 className="text-3xl font-bold text-purple-400 tracking-wide">SmartEdu</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-purple-400 rounded-lg hover:bg-purple-400 hover:text-gray-900 transition font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-purple-400 rounded-lg hover:bg-purple-300 text-gray-900 transition font-semibold"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ---------------------- Hero Section ---------------------- */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-10 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-900 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
            <pattern id="lines" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 0L100 100" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#lines)" />
          </svg>
        </div>

        {/* Hero Text */}
        <div className="md:w-1/2 space-y-6 z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
            Gamified Learning for Young Innovators
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Explore AI, Robotics, and Drones through interactive missions, earn badges, and level up your skills!
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-400 transition font-bold shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-purple-900 transition font-bold shadow-lg"
            >
              Login
            </button>
          </div>
        </div>

        {/* Hero Robot Illustration */}
        <div className="md:w-1/2 mt-10 md:mt-0 relative flex justify-center items-center">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <svg
              width="350"
              height="350"
              viewBox="0 0 200 200"
            >
              <rect x="65" y="60" width="70" height="100" rx="10" fill="#3B82F6" />
              <rect x="70" y="20" width="60" height="50" rx="8" fill="#60A5FA" />
              <circle cx="90" cy="45" r="6" fill="#FFFFFF" />
              <circle cx="110" cy="45" r="6" fill="#FFFFFF" />
              <rect x="40" y="70" width="25" height="60" rx="5" fill="#60A5FA" />
              <rect x="135" y="70" width="25" height="60" rx="5" fill="#60A5FA" />
              <rect x="140" y="90" width="35" height="45" rx="3" fill="#FCD34D" />
              <line x1="143" y1="100" x2="172" y2="100" stroke="#B45309" strokeWidth="2"/>
              <line x1="143" y1="110" x2="172" y2="110" stroke="#B45309" strokeWidth="2"/>
              <line x1="143" y1="120" x2="172" y2="120" stroke="#B45309" strokeWidth="2"/>
              <rect x="80" y="160" width="20" height="30" fill="#2563EB" />
              <rect x="105" y="160" width="20" height="30" fill="#2563EB" />
              <circle cx="15" cy="20" r="12" fill="#EC4899" />
              <circle cx="185" cy="40" r="10" fill="#F87171" />
              <circle cx="40" cy="180" r="15" fill="#A78BFA" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ---------------------- Features Section ---------------------- */}
      <section className="py-20 px-10 bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">What You Will Learn</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`bg-gray-900 p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition`}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 text-2xl" style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------- Gamified Track Section ---------------------- */}
      <section className="py-20 px-10 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Interactive Learning Track</h2>
        <div className="flex justify-center space-x-8 overflow-x-auto py-10 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-700">
          {missions.map((mission) => (
            <motion.div
              key={mission.id}
              whileHover={{ scale: 1.05 }}
              className={`min-w-[180px] h-48 rounded-3xl flex flex-col items-center justify-center shadow-lg cursor-pointer ${mission.color} text-gray-900 font-bold text-lg`}
            >
              <div className="text-5xl mb-2">{mission.icon}</div>
              <p>{mission.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------- Call to Action Section ---------------------- */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Start Your Adventure Today!</h2>
        <p className="mb-6 text-lg">Join thousands of students exploring AI, Robotics, and Drones in a fun gamified way.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-10 py-4 bg-white text-purple-700 rounded-full font-bold hover:scale-105 transition shadow-lg"
        >
          Join SmartEdu Now
        </button>
      </section>

      {/* ---------------------- Footer ---------------------- */}
      <footer className="py-6 bg-gray-900 text-gray-400 text-center">
        &copy; 2026 SmartEdu. All rights reserved.
      </footer>
    </div>
  );
}