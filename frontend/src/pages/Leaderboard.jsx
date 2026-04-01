import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaMedal, FaCrown, FaStar, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Leaderboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log("Fetching leaderboard with token:", token ? "Token present" : "No token");
        const res = await api.get("/leaderboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Leaderboard response:", res.data);
        if (res.data.success) {
          setLeaderboard(res.data.leaderboard || []);
          setUserRank(res.data.userRank);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-gray-200 p-6 lg:p-12 overflow-x-hidden">
      
      {/* Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all"
          >
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-purple-600">
              <FaArrowLeft size={14} />
            </div>
            <span className="font-bold uppercase text-xs tracking-widest">Back to Dashboard</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-black text-white flex items-center justify-center gap-4">
              <FaTrophy className="text-yellow-500" />
              GLOBAL RANKINGS
            </h1>
            <p className="text-gray-500 mt-2 font-bold uppercase tracking-[0.3em] text-xs">
              Elite Academy • Top Performers
            </p>
          </div>

          <div className="bg-purple-600/20 px-6 py-3 rounded-2xl border border-purple-500/30">
             <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest text-center">Your Rank</p>
             <h3 className="text-2xl font-black text-white text-center">#{userRank}</h3>
          </div>
        </div>

        {/* Podium (Top 3) */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16 px-4">
          
          {/* 2nd Place */}
          {top3[1] && (
            <div className="w-full md:w-64 order-2 md:order-1">
              <PodiumCard user={top3[1]} rank={2} color="bg-gray-400" icon={<FaMedal />} />
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="w-full md:w-80 order-1 md:order-2">
              <PodiumCard user={top3[0]} rank={1} color="bg-yellow-500" icon={<FaCrown />} isLarge />
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="w-full md:w-64 order-3">
              <PodiumCard user={top3[2]} rank={3} color="bg-orange-600" icon={<FaMedal />} />
            </div>
          )}
        </div>

        {/* Full List */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
          <div className="grid grid-cols-12 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 mb-4">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Explorer</div>
            <div className="col-span-2 text-center">Grade</div>
            <div className="col-span-2 text-right">XP Points</div>
          </div>

          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((user, idx) => (
                <div 
                  key={user._id} 
                  className={`grid grid-cols-12 items-center px-6 py-5 rounded-2xl border transition group ${
                    idx < 3 ? "bg-purple-500/5 border-purple-500/10" : "bg-gray-900/50 border-white/5 hover:border-purple-500/30"
                  }`}
                >
                  <div className={`col-span-2 font-black text-sm transition ${
                    idx === 0 ? "text-yellow-500" : 
                    idx === 1 ? "text-gray-400" : 
                    idx === 2 ? "text-orange-500" : "text-gray-500 group-hover:text-purple-400"
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center font-black text-white uppercase text-sm border border-white/10">
                      {user.name ? user.name[0] : "S"}
                    </div>
                    <div>
                      <span className="font-bold text-gray-200 block">{user.name || "Explorer"}</span>
                      {idx < 3 && <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest tracking-tighter">Top Performer</span>}
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-bold text-gray-400">
                    Grade {user.grade || "N/A"}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/20">
                       {user.xp?.toLocaleString() || "0"} XP
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No explorers have joined the ranks yet!</p>
                <div className="mt-4 flex justify-center opacity-20">
                  <FaStar size={30} className="animate-pulse text-yellow-500" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function PodiumCard({ user, rank, color, icon, isLarge }) {
  return (
    <div className={`relative flex flex-col items-center group transition duration-500 hover:scale-105 ${isLarge ? "mb-0" : "mb-0"}`}>
      <div className={`w-24 h-24 ${isLarge ? "w-32 h-32" : ""} rounded-[2rem] bg-gray-800 border-4 ${color.replace('bg-', 'border-')} flex items-center justify-center text-4xl shadow-2xl relative mb-6`}>
        <span className="text-white font-black">{user.name ? user.name[0].toUpperCase() : "S"}</span>
        <div className={`absolute -top-6 -right-6 ${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transform group-hover:rotate-12 transition`}>
          {icon}
        </div>
      </div>
      
      <div className={`w-full bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-xl ${isLarge ? "h-48" : "h-40"}`}>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Rank #{rank}</p>
        <h3 className="text-xl font-black text-white mb-2 truncate">{user.name || "Explorer"}</h3>
        <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold border border-purple-500/30 uppercase tracking-widest">
           {user.xp?.toLocaleString() || "0"} XP
        </div>
        {isLarge && (
          <p className="text-[10px] text-yellow-500 font-bold uppercase mt-4 tracking-widest flex items-center justify-center gap-2">
            <FaStar /> MASTER EXPLORER
          </p>
        )}
      </div>
    </div>
  );
}
