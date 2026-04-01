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
    <div className="relative min-h-screen bg-[#0A0C10] text-gray-200 overflow-hidden font-sans selection:bg-blue-500/30 selection:text-white">

      {/* ----------------- Cinematic Foundation (Zen-Professional) ----------------- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Obsidian Micro-Grid (Dots) */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#A855F7 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

        {/* Structural Schematics (Large Lines) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.1] pointer-events-none">
          <pattern id="structuralGridLand" width="400" height="400" patternUnits="userSpaceOnUse">
            <path d="M 400 0 L 0 0 0 400" fill="none" stroke="#A855F7" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#structuralGridLand)" />
        </svg>

        {/* Soft Gradient Mesh (Atmospheric Depth) */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-purple-600/10 rounded-full blur-[120px]"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Technical Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* ---------------------- Quantum Navbar ---------------------- */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-7xl px-8 py-4 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 flex justify-between items-center z-[100] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">🚀</div>
          <h1 className="text-xl font-black text-white tracking-[0.2em] uppercase">SmartEdu</h1>
        </div>

        <div className="flex items-center gap-6">
          <motion.button
            onClick={() => navigate("/login")}
            className="text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-widest transition-colors px-4"
            whileHover={{ y: -2 }}
          >
            Terminal Login
          </motion.button>
          <motion.button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-white text-[#0A0C10] text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-purple-400 hover:shadow-[0_0_20px_#A855F7] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Initialize Protocol
          </motion.button>
        </div>
      </nav>

      {/* ---------------------- Hero Section (The Portal) ---------------------- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center z-10">

        {/* Elite Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-md"
        >
          <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_#A855F7]"></div>
            Next-Gen AI Academy
          </span>
        </motion.div>

        {/* Hero Typography */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl"
        >
          <h2 className="text-purple-400 text-sm md:text-base font-black uppercase tracking-[0.6em] mb-6 opacity-80">Universal Intelligence</h2>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-widest uppercase leading-[0.9] mb-10">
            Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">Edu</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto font-medium leading-relaxed tracking-wide mb-12">
            Master any subject—from the laws of physics to the art of neural networks. Explore an infinite curriculum powered by 24/7 AI-facilitated interactive learning. Whatever your curiosity, we have the protocol for your mastery.
          </p>
        </motion.div>

        {/* Quantum CTAs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <button
            onClick={() => navigate("/register")}
            className="group relative px-12 py-5 rounded-full bg-purple-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] overflow-hidden transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            Start Immersion
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-12 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-black text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:border-white/30"
          >
            Access Terminal
          </button>
        </motion.div>

        {/* Hero Interactive Element (Cyber Core) */}
        <motion.div
          className="mt-24 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {/* Glow Layer */}
          <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full"></div>

          {/* Cyber Hub SVG Architecture */}
          <svg width="400" height="400" viewBox="0 0 400 400" className="relative group grayscale hover:grayscale-0 transition-all duration-700">
            <motion.circle
              cx="200" cy="200" r="120" fill="none" stroke="#A855F7" strokeWidth="0.5" strokeDasharray="10 20"
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="200" cy="200" r="100" fill="none" stroke="#D946EF" strokeWidth="2" strokeDasharray="5 5"
              animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M 200,80 L 320,200 L 200,320 L 80,200 Z" fill="none" stroke="#9333EA" strokeWidth="1"
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Inner Core */}
            <defs>
              <radialGradient id="coreGlow">
                <stop offset="0%" stopColor="#D946EF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="60" fill="url(#coreGlow)" className="animate-pulse" />
            <text x="200" y="210" textAnchor="middle" className="fill-white text-5xl font-black uppercase tracking-[0.2em] font-sans">AI</text>
          </svg>
        </motion.div>
      </section>

      {/* ---------------------- Universal Bento Grid Features ---------------------- */}
      <section className="relative py-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[0.3em] uppercase mb-4">The <span className="text-purple-500">Curriculum Engine</span></h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Generate interactive mastery on any topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card: Infinite Generator */}
            <motion.div
              whileHover={{ y: -10 }}
              className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col justify-end min-h-[400px] relative overflow-hidden group"
            >
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-600/20 blur-[80px] group-hover:bg-purple-600/40 transition-colors duration-700"></div>
              <div className="text-6xl mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500">⚛️</div>
              <h3 className="text-3xl font-black text-white tracking-widest uppercase mb-4">Infinite Subject Engine</h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl font-medium">From Mathematics to History, Science to Creative Arts—our AI Engine generates custom-tailored, interactive learning paths for any field of study. Learn what you want, when you want.</p>
            </motion.div>

            {/* Small Card 1: 24/7 AI Mentor */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col group"
            >
              <div className="text-5xl mb-6 group-hover:rotate-12 transition-transform">🤖</div>
              <h3 className="text-xl font-black text-white tracking-widest uppercase mb-4">AI Mentorship</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">A specialized intelligence tutor available 24/7 to provide real-time guidance and feedback in anyField.</p>
            </motion.div>

            {/* Small Card 2: Interactive Labs */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col group"
            >
              <div className="text-5xl mb-6 group-hover:-translate-y-2 transition-transform">🧪</div>
              <h3 className="text-xl font-black text-white tracking-widest uppercase mb-4">Hyper-Simulations</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">Master concepts through high-fidelity simulations for Science, Robotics, and Physics.</p>
            </motion.div>

            {/* Wide Card: Cognitive Bridge */}
            <motion.div
              whileHover={{ y: -10 }}
              className="md:col-span-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex items-center justify-between group"
            >
              <div className="max-w-md">
                <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Cross-Disciplinary Learning</h3>
                <p className="text-gray-400 font-medium text-sm">Bridge the gap between technology and the humanities with unique modules that explore the overlap of intelligence and society.</p>
              </div>
              <div className="text-7xl group-hover:rotate-[360deg] transition-transform duration-1000">🧬</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------- Mission Control Roadmap ---------------------- */}
      <section className="relative py-32 px-6 z-10 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[0.3em] uppercase mb-4">Mission <span className="text-purple-500">Roadmap</span></h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest font-sans">The Path to Intelligence Mastery</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 py-20">
            {[
              { id: 1, title: "Universal Foundation", icon: "💎", color: "purple" },
              { id: 2, title: "Neural Synthesis", icon: "🔗", color: "purple" },
              { id: 3, title: "Infinite Deep Dive", icon: "🌀", color: "fuchsia" },
              { id: 4, title: "Absolute Mastery", icon: "👑", color: "fuchsia" },
            ].map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 w-full md:w-64"
              >
                {/* Connecting Line (Only visible on desktop) */}
                {m.id < 4 && <div className="absolute top-1/2 left-full w-full h-[1px] bg-white/5 hidden md:block z-0"></div>}
                <div className="bg-[#0A0C10] border border-white/10 rounded-[2rem] p-8 text-center group hover:border-purple-500/50 transition-all duration-500 shadow-2xl relative z-10">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-purple-500/20 flex items-center justify-center text-4xl mb-6 shadow-xl`}>
                    {m.icon}
                  </div>
                  <h4 className="text-white font-black text-xs tracking-widest uppercase mb-2">Phase 0{m.id}</h4>
                  <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">{m.title}</p>
                </div>
                {/* Node Status Indicator */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0A0C10] border-4 border-gray-800 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------- Quantum Call to Action ---------------------- */}
      <section className="relative py-40 px-6 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-purple-600/5 backdrop-blur-[2px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase leading-tight mb-8">
              Ready to <span className="text-purple-500">Initialize?</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto tracking-wide">
              Join the next generation of neural architects. Your journey to master the infinite curriculum begins now.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="group relative px-16 py-6 bg-white text-[#0A0C10] font-black text-sm uppercase tracking-[0.4em] rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(168,85,247,0.6)] hover:bg-purple-400 transition-all duration-500 hover:scale-105"
            >
              Join Protocol
            </button>
          </motion.div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-[80%] h-full bg-purple-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      </section>

      {/* ---------------------- Technical Footer ---------------------- */}
      <footer className="relative py-12 px-10 bg-[#0A0C10] border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm">🚀</div>
            <p className="text-white font-black text-xs tracking-[0.3em] uppercase">SmartEdu Academy</p>
          </div>

          <div className="flex gap-10">
            {['Modules', 'Leaderboard', 'Terminal', 'Security'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black text-gray-500 hover:text-purple-400 uppercase tracking-widest transition-colors">{item}</a>
            ))}
          </div>

          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            &copy; 2026 SmartEdu. All systems operational.
          </p>
        </div>
      </footer>
    </div>
  );
}