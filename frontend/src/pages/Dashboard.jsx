import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaRobot,
  FaBrain,
  FaUserGraduate,
  FaBars,
  FaHome,
  FaRocket,
  FaMedal,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaTrophy
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(true);
  const [newTopic, setNewTopic] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setLeaderboardData(res.data.leaderboard.slice(0, 5));
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    };

    fetchProfile();
    fetchLeaderboard();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    try {
      const currentInterests = profile?.interestedSubjects || [];
      if (currentInterests.includes(newTopic.trim())) {
        alert("This topic is already in your path!");
        return;
      }

      const updatedInterests = [...currentInterests, newTopic.trim()];

      const res = await fetch("/api/profile/save-interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: profile._id,
          interests: updatedInterests
        })
      });

      const data = await res.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, interestedSubjects: updatedInterests }));
        setNewTopic("");
        setShowHelpModal(false);
        // Refresh to trigger AI or just update local state
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to add topic:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">

      {/* ---------------- Sidebar ---------------- */}
      <div
        className={`bg-gray-800 shadow-lg transition-all duration-300 ${open ? "w-64" : "w-20"
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

        <nav className="mt-6 space-y-2 px-2 overflow-y-auto max-h-[calc(100vh-150px)]">
          <SidebarItem icon={<FaHome />} text="Dashboard" open={open} link="/dashboard" />

          <div
            onClick={() => navigate("/leaderboard")}
            className={`flex items-center space-x-4 px-6 py-3 hover:bg-gray-700 cursor-pointer transition rounded-lg ${!open && "justify-center"}`}
          >
            <span className="text-lg text-yellow-500"><FaTrophy /></span>
            {open && <span className="font-medium text-gray-300">Leaderboard</span>}
          </div>

          <div className="mt-8 mb-2 px-4">
            <p className={`text-xs font-bold text-gray-500 uppercase tracking-widest ${!open && "hidden"}`}>My Paths</p>
            <div className={`h-px bg-gray-700 my-2 ${!open && "mx-2"}`}></div>
          </div>

          {profile?.interestedSubjects?.length > 0 ? (
            profile.interestedSubjects.map((subject, idx) => (
              <SidebarItem
                key={idx}
                icon={<FaBrain className="text-purple-400" />}
                text={subject}
                open={open}
                link={`/ai?topic=${encodeURIComponent(subject)}`}
              />
            ))
          ) : (
            <div className={`px-6 py-2 text-xs text-gray-500 italic ${!open && "hidden"}`}>
              No paths yet...
            </div>
          )}

          {/* Help Button (Request New Path) */}
          <div className="mt-8 border-t border-gray-700 pt-4 pb-10">
            <SidebarItem icon={<FaUserGraduate className="text-blue-400" />} text="My Profile" open={open} link="/profile" />

            <div
              onClick={() => setShowHelpModal(true)}
              className={`flex items-center space-x-4 px-6 py-3 mt-2 hover:bg-gray-700 cursor-pointer transition rounded-lg text-gray-400 hover:text-purple-400 ${!open && "justify-center px-0"}`}
            >
              <span className="text-lg"><FaQuestionCircle /></span>
              {open && <span className="font-medium">Help / Support</span>}
            </div>
          </div>
        </nav>

      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="flex-1 flex flex-col">

        {/* Top Header */}
        <header className="flex justify-between items-center bg-gray-800 px-8 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Student Dashboard</h2>

          <div className="flex items-center space-x-6">

            <span className="text-gray-400">Welcome, {profile?.name || "Student"}</span>
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

          {/* ---------------- Hero / AI Insights ---------------- */}
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-8 rounded-[2rem] border border-white/10 mb-10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-125 transition duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-purple-300 uppercase tracking-widest border border-white/5">
                  AI Recommendation
                </span>
                <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                <span className="text-xs text-gray-400 font-medium">Updated just now</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
                {profile?.recommendation || "Unlock Your Robotics Future"}
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl leading-relaxed italic border-l-2 border-purple-500 pl-4 py-1">
                "{profile?.aiInsight || "Ready to dive into the next chapter of your AI journey?"}"
              </p>
            </div>
            <div className="absolute bottom-4 right-8 opacity-20 pointer-events-none group-hover:opacity-40 transition duration-300">
              <FaRobot size={100} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card
              title="Missions Completed"
              value={profile?.completedMissions || "0"}
              icon="🚀"
              gradient="from-purple-600 to-indigo-700"
            />
            <Card
              title="Experience Points"
              value={profile?.xp || "0"}
              icon="⭐"
              gradient="from-blue-600 to-cyan-700"
            />
            <Card
              title="Achievement Badges"
              value={profile?.badges?.length || "0"}
              icon="🏅"
              gradient="from-emerald-600 to-teal-700"
            />
          </div>

          {/* Learning Progress (Totally Dynamic) */}
          <div className="bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-700 mb-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FaRocket className="text-purple-500" />
                Active Learning Progress
              </h3>
              <p className="text-sm text-gray-400">Track your sub-lesson completion</p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {profile?.courseProgress && profile.courseProgress.length > 0 ? (
                profile.courseProgress.map((cp, idx) => (
                  <ProgressBar key={idx} label={cp.topic} progress={cp.progress} />
                ))
              ) : (
                <div className="col-span-2 text-center py-10 text-gray-500 italic">
                  No active modules. Add a topic in the sidebar to start your journey!
                </div>
              )}
            </div>
          </div>

          {/* Recent Milestones (Latest Wins) */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaMedal className="text-yellow-500" />
                Your Recent Milestones
              </h3>

              <div className="space-y-4">
                {profile?.latestWins?.length > 0 ? (
                  profile.latestWins.map((win, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                          ✅
                        </div>
                        <div>
                          <p className="font-bold text-gray-200">{win.title}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Mission Mastered</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 italic">{new Date(win.date).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-gray-500 italic bg-gray-900/30 rounded-2xl">
                    No recent milestones. Start your first mission today!
                  </p>
                )}
              </div>
            </div>

            {/* Quick Helper Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-indigo-300 mb-2">Student Tip</h4>
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  "The best way to predict the future is to create it. Keep completing AI missions to unlock the secrets of neural networks!"
                </p>
              </div>
              <button
                onClick={() => setShowHelpModal(true)}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-900/20"
              >
                Get More Paths
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* ---------------- Help / Request Path Modal ---------------- */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative bg-gray-800 w-full max-w-md rounded-3xl p-8 border border-gray-700 shadow-2xl transition-all duration-300 transform scale-100">
            {/* Close Button */}
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
                <FaQuestionCircle size={30} className="text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Need a New Path?</h3>
              <p className="text-gray-400 mt-1">Request any AI learning topic below!</p>
            </div>

            <form onSubmit={handleAddTopic} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic Name</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Quantum Computing, Data Science..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  autoFocus
                  required
                />
              </div>

              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-800/30">
                <p className="text-xs text-purple-400 leading-relaxed italic">
                  Tip: Be specific! Our AI will generate exactly 5 modules tailored to your request.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-95 ${isLoading
                  ? "bg-gray-700 text-gray-400 cursor-wait"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Generating Path...
                  </span>
                ) : (
                  "Generate Path Now →"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Leaderboard Modal ---------------- */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative bg-gray-900 w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowLeaderboardModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
                <FaTrophy size={30} className="text-yellow-500" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Top Performers</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Real-time Global Rankings</p>
            </div>

            <div className="space-y-3 mb-8">
              {leaderboardData.map((user, idx) => (
                <div key={user._id} className="flex items-center bg-gray-800/50 p-4 rounded-2xl border border-white/5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mr-4 ${idx === 0 ? "bg-yellow-500 text-black" :
                      idx === 1 ? "bg-gray-400 text-black" :
                        idx === 2 ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-400"
                    }`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-200">{user.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Grade {user.grade}</p>
                  </div>
                  <span className="text-xs font-black text-blue-400">{user.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/leaderboard")}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition shadow-lg shadow-purple-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              View Full Rankings <FaArrowLeft className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, text, open, link }) {
  return (
    <Link to={link}>
      <div className="flex items-center space-x-4 px-6 py-3 hover:bg-gray-700 cursor-pointer transition">
        <span className="text-lg">{icon}</span>
        {open && <span>{text}</span>}
      </div>
    </Link>
  );
}

function Card({ title, value, icon, gradient }) {
  return (
    <div className={`p-8 rounded-3xl shadow-xl bg-gradient-to-br ${gradient} border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition duration-300`}>
      <div className="absolute -bottom-6 -right-6 text-9xl opacity-10 group-hover:scale-125 transition duration-500 transform rotate-12">{icon}</div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <p className="text-white/80 font-bold uppercase text-xs tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-black text-white">{value}</h2>
          <span className="text-white/30 text-xs">TOTAL</span>
        </div>
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