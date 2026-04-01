import { motion } from "framer-motion";
import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";

export default function Login() {
      const [loginData, setLoginData] = useState({
        email: "",
        password: ""
        });
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post("/auth/login", loginData);

        if (res.data.success) {
          alert("Login successful!");

          login(res.data.token);
          navigate("/dashboard");
        } else {
        alert(res.data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Login failed. Please try again.");
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
          <pattern id="structuralGridLogin" width="400" height="400" patternUnits="userSpaceOnUse">
            <path d="M 400 0 L 0 0 0 400" fill="none" stroke="#A855F7" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#structuralGridLogin)" />
        </svg>

        {/* Soft Gradient Mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ---------------------- Login Card ---------------------- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden"
      >
        {/* Card Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[60px] rounded-full"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
           <div 
             onClick={() => navigate("/")}
             className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-purple-500/20 mb-4 cursor-pointer hover:scale-110 transition-transform"
           >🚀</div>
           <h1 className="text-sm font-black text-purple-400 uppercase tracking-[0.4em] mb-2">Protocol Access</h1>
           <h2 className="text-3xl font-black text-white uppercase tracking-widest leading-none">Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">Back</span></h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Neural Identifier</label>
            <div className="relative group">
              <FaEnvelope className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                placeholder="EMAIL@TERMINAL.COM"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white/5 border border-white/5 text-white placeholder-gray-600 text-xs font-bold tracking-widest focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Access Key</label>
            <div className="relative group">
              <FaLock className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white/5 border border-white/5 text-white placeholder-gray-600 text-xs font-bold tracking-widest focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full py-5 rounded-[1.5rem] bg-purple-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] overflow-hidden transition-all duration-500 mt-4"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
             Initialize login
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              No protocol established? {" "}
              <span
                className="text-purple-400 cursor-pointer hover:text-fuchsia-400 transition-colors"
                onClick={() => navigate("/register")}
              >
                Sync New Account
              </span>
            </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 flex items-center justify-center gap-2 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-[0.3em] transition-colors"
        >
          <FaArrowLeft /> Abort Mission
        </button>
      </motion.div>
    </div>
  );
}