import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaUser, FaEnvelope, FaGraduationCap, 
  FaStar, FaAward, FaLock, FaEdit, FaCheck, FaTimes,
  FaSignOutAlt, FaRocket, FaFire
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", grade: "" });
  
  // Password States
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passMsg, setPassMsg] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    if (!token) {
      setError("No session found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUserData(res.data.user);
        setEditForm({ 
          name: res.data.user.name || "", 
          grade: res.data.user.grade || "" 
        });
      } else {
        setError("Failed to sync profile");
      }
    } catch (err) {
      setError("Server connection lost");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile/update", editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUserData(res.data.user);
        setIsEditing(false);
        alert("Profile updated successfully! ✨");
      }
    } catch (err) {
      alert("Failed to update profile. Please check your details.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      const res = await api.post(
        "/auth/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMsg(res.data.message || "Security settings updated.");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassMsg("Update failed. Check current password.");
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0c10] text-gray-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ---------------- Background Accents ---------------- */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-12 max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-3 mb-10 text-gray-400 hover:text-white transition-all"
        >
          <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition">
            <FaArrowLeft size={14} />
          </div>
          <span className="font-bold tracking-wide uppercase text-xs">Back to Hub</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Hero & Edit */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl">
              <div className="bg-gray-800 p-8 rounded-[2rem] relative overflow-hidden">
                {/* Hero Gradient Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-purple-500/20 relative group">
                    {userData.name ? userData.name[0].toUpperCase() : "S"}
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-gray-800 flex items-center justify-center shadow-lg">
                       <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <div className="space-y-4 text-left">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Display Name</label>
                          <input 
                            className="text-3xl font-black bg-gray-900/50 border-b-2 border-purple-500 focus:outline-none w-full text-white px-2 py-1 rounded-t-lg"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            placeholder="Your Name"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Academic Grade</label>
                            <input 
                              type="number"
                              className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-2 w-full text-white font-bold focus:border-purple-500 outline-none"
                              value={editForm.grade}
                              onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                          {userData.name || "Academy Student"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                          <span className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-bold border border-purple-500/30 uppercase">
                            <FaGraduationCap /> Grade {userData.grade}
                          </span>
                          <span className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 uppercase">
                            <FaFire /> {userData.xp || 0} XP Points
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <button onClick={handleUpdateProfile} className="w-12 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transition transform active:scale-90">
                          <FaCheck size={18} />
                        </button>
                        <button onClick={() => setIsEditing(false)} className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-2xl flex items-center justify-center shadow-lg transition transform active:scale-90">
                          <FaTimes size={18} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="w-14 h-14 bg-gray-700 hover:bg-purple-600 hover:text-white rounded-2xl flex items-center justify-center transition shadow-lg text-gray-300"
                      >
                        <FaEdit size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <StatCard 
                icon={<FaEnvelope />} 
                label="Primary Email" 
                value={userData.email} 
                sub="Secure Identity Verified"
                color="from-blue-600 to-indigo-700" 
              />
              <StatCard 
                icon={<FaRocket />} 
                label="Learning Status" 
                value="Elite Explorer"
                sub="Top 5% Achievement Tier"
                color="from-orange-600 to-red-700" 
              />
            </div>

            {/* Interests Section */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-[2rem] border border-white/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <FaStar className="text-yellow-500" />
                  Path Expertise
                </h3>
              </div>
              <div className="flex flex-wrap gap-4 font-bold uppercase tracking-wider text-[10px]">
                {userData.interestedSubjects?.map((subject, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-700 px-6 py-3 rounded-2xl shadow-xl hover:border-purple-500/50 transition cursor-default">
                    {subject}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Security & Logout */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Password Form */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-[2rem] border border-white/5 p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <FaLock className="text-purple-400" />
                Vault Security
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input 
                  type="password"
                  placeholder="Secret Key (Current)"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition"
                  required
                />
                <input 
                  type="password"
                  placeholder="New Protocol (Key)"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition"
                  required
                />
                {passMsg && <p className="text-xs font-bold text-center py-2 text-emerald-400 drop-shadow-md uppercase tracking-widest">{passMsg}</p>}
                <button 
                  type="submit"
                  disabled={passLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-2xl font-bold shadow-2xl shadow-purple-900/20 active:scale-95 transition"
                >
                  {passLoading ? "Syncing..." : "Update Security"}
                </button>
              </form>
            </div>

            {/* Global Standing */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-[2rem] border border-white/5 p-8 shadow-xl">
              <h3 className="text-white font-bold mb-8 flex items-center gap-3 uppercase text-xs tracking-widest opacity-60">
                Global Standing
              </h3>
              <div className="space-y-6">
                <RankItem icon="🥇" label="Global Rank" value={`#${userData.globalRank || "---"}`} />
                <RankItem icon="🔥" label="Status" value={userData.streak || "New Explorer"} />
                <RankItem icon="🚀" label="Power Tier" value={userData.powerTier || "Bronze"} />
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={() => { logout(); navigate("/"); }}
              className="w-full group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-5 rounded-3xl font-black border border-red-500/20 transition flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs"
            >
              <FaSignOutAlt />
              Exit Academy
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 relative overflow-hidden group hover:scale-[1.03] transition duration-500 shadow-2xl">
      <div className={`absolute -bottom-6 -right-6 text-9xl opacity-[0.03] bg-gradient-to-br ${color} transition duration-700 transform rotate-12 group-hover:scale-125`}>
        {icon}
      </div>
      <div className="relative z-10 flex items-center gap-6">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{label}</p>
          <h4 className="text-xl font-black text-white truncate max-w-[150px]">{value}</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function RankItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-4">
        <span className="text-lg group-hover:scale-125 transition inline-block">{icon}</span>
        <span className="text-gray-400 font-bold text-sm tracking-tight">{label}</span>
      </div>
      <span className="text-white font-black">{value}</span>
    </div>
  );
}