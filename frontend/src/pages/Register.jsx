import { motion } from "framer-motion";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaEnvelope, FaGraduationCap, FaArrowLeft } from "react-icons/fa";

export default function Register() {

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    grade: ""
  });
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Sending data:", registerData);

    try {
      const res = await api.post("/auth/register", registerData);

      if (res.data.success) {
        alert("Registration successful!");
        login(res.data.token);
        navigate("/profile-setup");
      } else {
        alert(res.data.message);
      }

    } catch (error) {
      console.log("Backend error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative h-screen bg-[#0A0C10] text-gray-200 overflow-hidden font-sans selection:bg-purple-500/30 selection:text-white flex items-center justify-center p-4">
      
      {/* ----------------- Cinematic Foundation (Zen-Professional) ----------------- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Obsidian Micro-Grid (Dots) */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#A855F7 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Structural Schematics (Large Lines) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.1] pointer-events-none">
          <pattern id="structuralGridReg" width="400" height="400" patternUnits="userSpaceOnUse">
            <path d="M 400 0 L 0 0 0 400" fill="none" stroke="#A855F7" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#structuralGridReg)" />
        </svg>

        {/* Soft Gradient Mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[120px]"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ---------------------- Register Card ---------------------- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden"
      >
        {/* Card Decorative Glow */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-600/20 blur-[60px] rounded-full"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div
            onClick={() => navigate("/")}
            className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-xl shadow-purple-500/20 mb-4 cursor-pointer hover:scale-110 transition-transform"
          >🚀</div>
          <h1 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-1">Initialize protocol</h1>
          <h2 className="text-3xl font-black text-white uppercase tracking-widest leading-none">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Account</span></h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Neural Name</label>
            <div className="relative group">
              <FaUser className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="USER_IDENTIFIER"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="w-full pl-14 pr-6 py-3.5 rounded-[1.5rem] bg-white/5 border border-white/5 text-white placeholder-gray-600 text-xs font-bold tracking-widest focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Neural identifier</label>
            <div className="relative group">
              <FaEnvelope className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                placeholder="EMAIL@TERMINAL.COM"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full pl-14 pr-6 py-3.5 rounded-[1.5rem] bg-white/5 border border-white/5 text-white placeholder-gray-600 text-xs font-bold tracking-widest focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Grade Dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Academy Level</label>
            <div className="relative group">
              <FaGraduationCap className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10" />
              <select
                required
                value={registerData.grade}
                onChange={(e) => setRegisterData({ ...registerData, grade: Number(e.target.value) })}
                className="w-full pl-14 pr-6 py-3.5 rounded-[1.5rem] bg-white/5 border border-white/5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-xs font-bold tracking-widest appearance-none cursor-pointer relative z-0"
              >
                <option value="" className="bg-[#0A0C10]">SELECT_LEVEL</option>
                <option value="6" className="bg-[#0A0C10]">GRADE 06</option>
                <option value="7" className="bg-[#0A0C10]">GRADE 07</option>
                <option value="8" className="bg-[#0A0C10]">GRADE 08</option>
                <option value="9" className="bg-[#0A0C10]">GRADE 09</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">▼</div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Access Key</label>
            <div className="relative group">
              <FaLock className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full pl-14 pr-6 py-3.5 rounded-[1.5rem] bg-white/5 border border-white/5 text-white placeholder-gray-600 text-xs font-bold tracking-widest focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full py-4 rounded-[1.5rem] bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] overflow-hidden transition-all duration-500 mt-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            Sync Account
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
            Protocol already synchronized? {" "}
            <span
              className="text-purple-400 cursor-pointer hover:text-fuchsia-400 transition-colors"
              onClick={() => navigate("/login")}
            >
              Access Terminal
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 flex items-center justify-center gap-2 text-[8px] font-black text-gray-600 hover:text-white uppercase tracking-[0.3em] transition-colors"
        >
          <FaArrowLeft /> Abort mission
        </button>
      </motion.div>
    </div>
  );
}
