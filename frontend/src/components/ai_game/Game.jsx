import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import QuizModal from "./QuizModal";
import PlatformerGame from "./PlatformerGame";
import SpaceShooterGame from "./SpaceShooterGame";
import BoatNavigationGame from "./BoatNavigationGame";
import MazeRunnerGame from "./MazeRunnerGame";
import DataCatchGame from "./DataCatchGame";
import { quests } from "../../ai_game_data";

export default function AIQuestOpenWorld() {
  const [currentQuest, setCurrentQuest] = useState(0);
  const { token } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);
  const [playingPlatformer, setPlayingPlatformer] = useState(false);
  const [robotPosition, setRobotPosition] = useState({ x: 100, y: 500 }); // Start at door
  const [gameStarted, setGameStarted] = useState(false);
  const [nearBuilding, setNearBuilding] = useState(null);
  const bgAudioRef = useRef(null);
  const moveAudioRef = useRef(null);
  const quizAudioRef = useRef(null);

  const cloudConfigs = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      duration: 8 + Math.random() * 4,
      delay: i * 1.2,
      top: `${10 + Math.random() * 30}%`,
      left: `${Math.random() * 100}%`
    }));
  }, []);

  const particleConfigs = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      xRange: Math.random() * 50 - 25,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 5,
      left: `${Math.random() * 100}%`,
      top: `${60 + Math.random() * 30}%`
    }));
  }, []);

  const sparkConfigs = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 3,
      left: `${Math.random() * 100}%`,
      top: `${5 + Math.random() * 25}%`
    }));
  }, []);

  const [score, setScore] = useState(0);
  const [searchParams] = useSearchParams();
  const [activeLesson, setActiveLesson] = useState(null);
  const [missions, setMissions] = useState([]);
  const [buildings, setBuildings] = useState([
    { id: 1, name: "Loading...", x: 150, y: 120, questIndex: 0, completed: false, icon: "🧠", color: "bg-blue-600", accentColor: "border-blue-400", shadowColor: "shadow-blue" },
    { id: 2, name: "Loading...", x: 450, y: 350, questIndex: 1, completed: false, icon: "🤖", color: "bg-emerald-600", accentColor: "border-emerald-400", shadowColor: "shadow-emerald" },
    { id: 3, name: "Loading...", x: 750, y: 180, questIndex: 2, completed: false, icon: "🕸️", color: "bg-purple-600", accentColor: "border-purple-400", shadowColor: "shadow-purple" },
    { id: 4, name: "Loading...", x: 980, y: 420, questIndex: 3, completed: false, icon: "👁️", color: "bg-rose-600", accentColor: "border-rose-400", shadowColor: "shadow-rose" },
    { id: 5, name: "Loading...", x: 1150, y: 100, questIndex: 4, completed: false, icon: "💬", color: "bg-amber-600", accentColor: "border-amber-400", shadowColor: "shadow-amber" },
  ]);

  const [newlyCompleted, setNewlyCompleted] = useState([]);
  const sessionCompletedRef = useRef(new Set());

  // Derive subLessons from activeLesson if available
  const subLessons = useMemo(() => activeLesson?.subLessons || [], [activeLesson]);

  // 1. Fetch User Profile (to get XP and interestedSubjects)
  useEffect(() => {
    const initGameData = async () => {
      if (!token) return;
      try {
        console.log("[DEBUG] Initializing game data...");
        // 1. Fetch Profile
        const profileRes = await fetch("/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        
        if (!profileData.success) {
          console.error("[ERROR] Profile fetch failed:", profileData.message);
          return;
        }

        setScore(profileData.user.xp || 0);

        // 2. Fetch/Generate Lessons
        const targetTopic = searchParams.get("topic");
        const interestsToFetch = targetTopic 
          ? [targetTopic] 
          : (profileData.user.interestedSubjects?.length > 0 
              ? [profileData.user.interestedSubjects[0]] 
              : ["Artificial Intelligence"]);

        console.log("[DEBUG] Fetching lessons for:", interestsToFetch);

        const lessonRes = await fetch("/api/ai/lessons", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            interests: interestsToFetch
          })
        });
        
        if (!lessonRes.ok) {
          const errData = await lessonRes.json();
          console.error("[ERROR] AI Lessons Fetch failed:", errData.error || lessonRes.statusText);
          // Fallback: If AI fails, try to find ANY existing lesson for the user or grade
          return;
        }

        const lessonData = await lessonRes.json();
        
        if (!lessonData.success || !lessonData.lessons || lessonData.lessons.length === 0) {
          console.error("[ERROR] AI Lessons not found in success response");
          return;
        }

        const currentLesson = lessonData.lessons[0];
        setActiveLesson(currentLesson);
        console.log("[DEBUG] Active Lesson:", currentLesson.topic);

        // 3. Fetch Missions for this lesson to get IDs
        const missionRes = await fetch(`/api/missions/${currentLesson._id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!missionRes.ok) {
          console.error("[ERROR] Missions fetch failed");
          return;
        }

        const missionData = await missionRes.json();
        setMissions(missionData);

        // 4. Update Buildings from Lesson Structure
        setBuildings(prev => prev.map((b, i) => {
          const sub = currentLesson.subLessons[i];
          if (sub) {
            // Find corresponding mission ID by title (Case-insensitive)
            const mission = missionData.find(m => m.title.toLowerCase().trim() === sub.title.toLowerCase().trim());
            return {
              ...b,
              name: sub.title,
              missionId: mission ? mission._id : null
            };
          }
          return b;
        }));

        // 5. Fetch Progress
        const progressRes = await fetch(`/api/progress/ai-status?lessonId=${currentLesson._id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const progressData = await progressRes.json();
        
        if (progressData.success) {
          console.log("[DEBUG] Progress Indices:", progressData.completedIndices);
          const completedIndices = progressData.completedIndices;
          setBuildings(prev => prev.map((b, i) => {
            const completed = completedIndices.includes(i);
            if (completed) sessionCompletedRef.current.add(b.id);
            return { ...b, completed };
          }));
        }

      } catch (err) {
        console.error("[CRITICAL] Game data initialization error:", err);
      }
    };
    initGameData();
  }, [token]);
  // End of initialization

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = 0.3;
      
      if (gameStarted && !playingPlatformer && !showQuiz) {
        bgAudioRef.current.play().catch(() => {});
      } else {
        bgAudioRef.current.pause();
      }
    }

    const handleKey = (e) => {
      if (!gameStarted || playingPlatformer || showQuiz) return;

      const { x, y } = robotPosition;
      let newX = x;
      let newY = y;
      const step = 15;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(20, y - step);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(window.innerHeight - 100, y + step);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(20, x - step);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(window.innerWidth - 80, x + step);
          break;
        case 'Enter':
          if (nearBuilding && !nearBuilding.completed) {
            setPlayingPlatformer(true);
            if (quizAudioRef.current) {
              quizAudioRef.current.play().catch(() => {});
            }
          }
          return;
        default:
          return;
      }

      setRobotPosition({ x: newX, y: newY });
      if (moveAudioRef.current) {
        moveAudioRef.current.play().catch(() => {});
      }

      // Proximity check for buildings (Only unlocked ones)
      const newNearBuilding = buildings.find((b, i) => {
        const isLocked = i > 0 && !buildings[i-1].completed;
        return !isLocked && Math.abs(b.x - newX) < 100 && Math.abs(b.y - newY) < 100;
      });
      setNearBuilding(newNearBuilding || null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [robotPosition, gameStarted, nearBuilding, playingPlatformer, showQuiz]);

  const handleCloseQuiz = (lessonScore) => {
    if (lessonScore <= 8) {
      alert("Oops! Adventure failed! You need more than 8 points to pass. Try reading the data fragments again!");
      setShowQuiz(false);
      setNearBuilding(null);
      return;
    }

    let earnedXp = 50; 
    if (nearBuilding && activeLesson?.subLessons) {
      earnedXp = activeLesson.subLessons[nearBuilding.questIndex]?.xp || 50;
    }
    
    const totalAwarded = earnedXp + (lessonScore * 10);
    
    setScore(prev => prev + totalAwarded);
    setShowQuiz(false);

    if (nearBuilding) {
      // Persist to database (Registers mission completion and awards XP)
      if (token && nearBuilding.missionId) {
        fetch("/api/progress/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            missionId: nearBuilding.missionId,
            status: "completed"
          })
        })
        .then(res => res.json())
        .then(data => {
           if (data.success && data.totalXp !== undefined) {
             setScore(data.totalXp);
           }
        })
        .catch(err => console.error("Mission Progress Error:", err));
      }

      // Mark building as completed and trigger ONE notification
      if (!sessionCompletedRef.current.has(nearBuilding.id)) {
        sessionCompletedRef.current.add(nearBuilding.id);
        const completedBuilding = { ...nearBuilding, completed: true };
        setNewlyCompleted(prev => [...prev, completedBuilding]);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
          setNewlyCompleted(prev => prev.filter(b => b.id !== completedBuilding.id));
        }, 4000);
      }

      setBuildings(prev => {
        const newBuildings = prev.map(b => 
          b.id === nearBuilding.id ? { ...b, completed: true } : b
        );
        
        const completedCount = newBuildings.filter(b => b.completed).length;
        if (completedCount >= newBuildings.length) {
          // All done!
        }
        
        return newBuildings;
      });
      setNearBuilding(null);
    }
  };

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />;
  }

  return (
    <div className="relative w-screen h-screen bg-[#0A0C10] overflow-hidden font-sans cursor-default">
      {/* ----------------- Background Elements (Zen-Professional) ----------------- */}
      
      {/* Obsidian Micro-Grid (Dots) */}
      <div className="absolute inset-0 bg-[#0A0C10]">
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#38BDF8 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0C10_80%)]"></div>
      </div>

      {/* Technical Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Structural Schematics (Box-like Lines - Increased Visibility) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.2] pointer-events-none">
        <pattern id="structuralGrid" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#38BDF8" strokeWidth="0.8"/>
          <circle cx="0" cy="0" r="2.5" fill="#38BDF8" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#structuralGrid)" />
        
        {/* Large Decorative Technical Rectangles */}
        <rect x="5%" y="5%" width="40%" height="50%" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="10 20" />
        <rect x="55%" y="45%" width="35%" height="40%" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="15 30" />
        
        {/* Corner Brackets */}
        <path d="M 60 60 L 30 60 L 30 30" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
        <path d="M 94% 60 L 97% 60 L 97% 30" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
      </svg>

      {/* Soft Gradient Mesh (Corner Lighting) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>


      {/* ----------------- Glowing Pathways (Sequential Logic) ----------------- */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none z-0">
        {buildings.map((b, i) => {
          if (i === 0) return null;
          const prev = buildings[i - 1];
          const isUnlocked = prev.completed;
          return (
            <motion.line
              key={`path-${i}`}
              x1={prev.x + 70}
              y1={prev.y + 50}
              x2={b.x + 70}
              y2={b.y + 50}
              stroke={isUnlocked ? "#10B981" : "#374151"}
              strokeWidth={isUnlocked ? "2" : "1"}
              strokeDasharray="10 15"
              animate={isUnlocked ? {
                strokeDashoffset: [0, -25],
                opacity: [0.3, 0.8, 0.3]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          );
        })}
      </svg>

      {/* Door (Starting Point) */}
      <motion.div
        className="absolute left-20 bottom-20 w-16 h-24 bg-amber-800 rounded-t-lg shadow-lg border-4 border-amber-900 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 15px rgba(245, 158, 11, 0.3)",
            "0 0 25px rgba(245, 158, 11, 0.6)",
            "0 0 15px rgba(245, 158, 11, 0.3)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            className="text-2xl"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🚪
          </motion.div>
        </div>
      </motion.div>

      {/* High-Fidelity Crystal Hub Buildings */}
      {buildings.map((building, index) => {
        const isLocked = index > 0 && !buildings[index - 1].completed;
        const isActive = nearBuilding?.id === building.id;
        
        return (
          <motion.div
            key={building.id}
            className={`absolute cursor-pointer transition-all duration-500 z-10`}
            style={{
              left: building.x,
              top: building.y,
              width: '160px',
              height: '110px'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isLocked ? 0.95 : building.completed ? 1.05 : 1,
              opacity: 1
            }}
            whileHover={!isLocked ? { scale: 1.1, y: -5 } : {}}
          >
            {/* Multi-Layer Crystal Architecture */}
            <div className={`relative w-full h-full rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center backdrop-blur-3xl shadow-2xl transition-all duration-500 ${
               isLocked ? 'bg-black/80 grayscale' : building.completed ? 'bg-emerald-500/10' : 'bg-blue-600/10'
            }`}>
              
              {/* Technical Outline (Glow Pulse) */}
              <motion.div 
                className={`absolute inset-0 border-2 rounded-2xl ${
                   isLocked ? 'border-gray-800' : building.completed ? 'border-emerald-400/50' : 'border-blue-400/50'
                }`}
                animate={!isLocked ? { opacity: [0.3, 0.8, 0.3], scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Inner Glowing Data Core */}
              <div className="absolute z-0 w-24 h-24 blur-[30px] rounded-full opacity-40 transition-all duration-700" style={{
                background: isLocked ? '#1F2937' : building.completed ? 'radial-gradient(circle, #10B981, transparent)' : 'radial-gradient(circle, #3B82F6, transparent)',
                scale: isActive ? 1.5 : 1
              }}></div>

              {/* Icon & Identity */}
              <div className="relative z-10 flex flex-col items-center">
                 <div className={`text-4xl mb-2 transition-transform duration-500 ${isActive ? 'scale-125' : ''}`}>
                   {isLocked ? "🔒" : building.icon}
                 </div>
                 
                 {/* Standardized Academy Label */}
                 <div className="bg-black/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                   <p className="text-[9px] font-black text-white tracking-widest uppercase leading-none">
                     {isLocked ? "Locked Protocol" : building.name}
                   </p>
                 </div>
              </div>

              {/* Completion Highlight */}
              {building.completed && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-emerald-500/90 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]">
                  <span className="text-white text-[10px]">✨</span>
                </div>
              )}

              {/* Interaction Overlay */}
              {isActive && !building.completed && (
                <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-end pb-2">
                   <div className="text-[8px] font-black text-white px-2 py-1 bg-blue-600 rounded-sm animate-pulse tracking-widest uppercase">
                      Sync Initialized
                   </div>
                </div>
              )}
            </div>

            {/* Reflection Glare */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-30"></div>
          </motion.div>
        );
      })}

      {/* Robot Character */}
      <motion.div
        className="absolute z-20"
        animate={{
          x: robotPosition.x,
          y: robotPosition.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="text-4xl drop-shadow-lg"
          animate={{
            y: [0, -3, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 }
          }}
        >
          🤖
        </motion.div>

        {/* Robot glow effect when near building */}
        {nearBuilding && (
          <motion.div
            className="absolute inset-0 bg-blue-400/30 rounded-full blur-md"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Robot speech bubble when near building */}
        {nearBuilding && !nearBuilding.completed && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-blue-300 shadow-lg"
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: [10, 0, -2, 0] }}
            transition={{ duration: 0.5, y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
          >
            <div className="text-[10px] font-black text-blue-800 uppercase tracking-widest whitespace-nowrap">
              Press ENTER to Learn 🎓
            </div>
            {/* Speech bubble pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
          </motion.div>
        )}
      </motion.div>

      {/* UI Header (Professional & Compact) */}
      <motion.div
        className="absolute top-6 left-6 right-6 flex justify-between items-start z-50 pointer-events-none"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
      >
        {/* Campus Header (Compact) */}
        <div className="flex gap-4 items-center pointer-events-auto">
          {/* Active Objective Tracker */}
          <div className="hidden lg:block bg-black/60 backdrop-blur-xl px-8 py-5 rounded-[2rem] border border-white/10 min-w-[280px] shadow-2xl">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-1 h-1 bg-blue-400 rounded-full"></span> 
               Active Objective
            </p>
            <h4 className="text-white font-black text-xs uppercase tracking-widest truncate">
              {(() => {
                const nextBuilding = buildings.find(b => !b.completed);
                if (nearBuilding && !nearBuilding.completed) return `Initializing: ${nearBuilding.name}`;
                return nextBuilding ? `Deploy: ${nextBuilding.name}` : "Core Mastered";
              })()}
            </h4>
          </div>
        </div>

        {/* User Stats Card (Simplified) */}
        <div className="bg-black/60 backdrop-blur-3xl p-1.5 rounded-[2rem] border border-white/10 shadow-2xl pointer-events-auto">
          <div className="bg-gray-900/60 px-8 py-4 rounded-[1.8rem]">
            <div className="text-center">
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Power LVL</p>
               <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-widest">
                 {score.toLocaleString()} <span className="text-[10px] text-blue-400">XP</span>
               </h3>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex justify-between items-center text-white">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.h4
              className="font-semibold mb-1"
              animate={{ color: ["#ffffff", "#fbbf24", "#ffffff"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Controls:
            </motion.h4>
            <p className="text-sm">• Arrow Keys or WASD to move • Press ENTER near buildings to learn</p>
          </motion.div>
          <motion.div
            className="text-right"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.h4
              className="font-semibold mb-1"
              animate={{ color: ["#ffffff", "#10b981", "#ffffff"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              Goal:
            </motion.h4>
            <p className="text-sm">Visit all buildings and complete AI lessons!</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="absolute top-1/2 right-4 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      >
        <div className="text-center">
          <motion.div
            className="text-2xl mb-2"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            🏆
          </motion.div>
          <div className="text-white font-bold text-sm">Progress</div>
          <div className="w-16 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(buildings.filter(b => b.completed).length / buildings.length) * 100}%`
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-white/80 mt-1">
            {buildings.filter(b => b.completed).length}/{buildings.length}
          </div>
        </div>
      </motion.div>

      {/* Completion Celebration */}
      {buildings.length > 0 && buildings.every(b => b.completed) && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-zinc-800 border border-zinc-700 shadow-[0_0_30px_rgba(251,191,36,0.3)] rounded-2xl p-8 text-center text-white"
            initial={{ scale: 0, rotate: -10 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 0.8,
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎉🏆🎊
            </motion.div>
            <motion.h2
              className="text-3xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Congratulations!
            </motion.h2>
            <motion.p
              className="text-lg mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              You've mastered all AI concepts! 🌟
            </motion.p>
            <motion.button
              className="bg-white text-orange-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Play Again! 🔄
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Achievement Notifications (Show only NEW completions this session) */}
      {newlyCompleted.map((building, index) => (
        <motion.div
          key={`achievement-${building.id}`}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 border border-emerald-400 text-white px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(5,150,105,0.5)] z-30"
          initial={{ y: -100, opacity: 0, scale: 0.5 }}
          animate={{
            y: [20, 0, -20],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.8]
          }}
          transition={{
            duration: 3,
            delay: index * 0.5,
            ease: "easeOut",
            opacity: { duration: 2.5 }
          }}
          style={{ top: `${100 + index * 80}px` }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <div>
              <div className="font-bold">Lesson Completed!</div>
              <div className="text-sm opacity-90">{building.name}</div>
            </div>
            <span className="text-2xl">✨</span>
          </div>
        </motion.div>
      ))}

      {/* Multi-Game Reading Phase */}
      {playingPlatformer && nearBuilding && (() => {
        const gameProps = {
          lesson: (subLessons && subLessons.length > 0 && subLessons[nearBuilding.questIndex]) 
            ? subLessons[nearBuilding.questIndex] 
            : quests[nearBuilding.questIndex],
          onComplete: () => {
            setPlayingPlatformer(false);
            setShowQuiz(true);
          },
          onExit: () => {
            setPlayingPlatformer(false);
            setNearBuilding(null);
          },
          onHitBlock: () => {
            if (moveAudioRef.current) {
              moveAudioRef.current.currentTime = 0;
              moveAudioRef.current.play().catch(() => {});
            }
          }
        };

        switch (nearBuilding.questIndex) {
          case 0: return <PlatformerGame {...gameProps} />;
          case 1: return <SpaceShooterGame {...gameProps} />;
          case 2: return <BoatNavigationGame {...gameProps} />;
          case 3: return <MazeRunnerGame {...gameProps} />;
          case 4: return <DataCatchGame {...gameProps} />;
          default: return <PlatformerGame {...gameProps} />;
        }
      })()}

      {/* Quiz Modal */}
      {showQuiz && nearBuilding && (
        <QuizModal
          isOpen={true}
          lesson={(subLessons && subLessons.length > 0 && subLessons[nearBuilding.questIndex]) 
            ? subLessons[nearBuilding.questIndex] 
            : quests[nearBuilding.questIndex]}
          onClose={handleCloseQuiz}
        />
      )}

      {/* Audio */}
      <audio ref={bgAudioRef} src="/assets/ai_game/bgMusic.mp3" />
      <audio ref={moveAudioRef} src="/assets/ai_game/clickSound.mp3" />
      <audio ref={quizAudioRef} src="/assets/ai_game/clickSound.mp3" />
    </div>
  );
}

// Enhanced Start Screen
function StartScreen({ onStart }) {
  return (
    <div className="relative w-full h-screen bg-[#050A14] overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Animated Deep Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>
        <motion.div
          className="absolute -top-40 -left-40 w-[45rem] h-[45rem] bg-indigo-900/30 rounded-full blur-[120px] mix-blend-screen"
          animate={{ x: [0, 60, 0], y: [0, -60, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[45rem] h-[45rem] bg-fuchsia-900/20 rounded-full blur-[120px] mix-blend-screen"
          animate={{ x: [0, -60, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[55rem] bg-cyan-900/10 rounded-full blur-[150px] mix-blend-screen"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center">
        
        {/* Main Title Area */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="inline-block mb-4 px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <span className="text-indigo-300 tracking-[0.2em] uppercase text-xs font-black flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mr-3 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              Virtual Learning Environment v2.0
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-purple-400 drop-shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            AI Learning Campus
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/60 max-w-3xl mx-auto font-medium leading-relaxed">
            Embark on a hyper-interactive journey through neural networks, machine learning models, and advanced cognitive robotics.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
          {[
            { icon: "⛩️", title: "Enter the Campus", desc: "Start your journey at the main entrance corridor" },
            { icon: "🏛️", title: "Explore Modules", desc: "Navigate interactive learning buildings across the map" },
            { icon: "🎯", title: "Master Concepts", desc: "Complete data fragments and exams to level up" }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.8, type: "spring", stiffness: 120 }}
              className="bg-[#0c1222]/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/5 hover:border-indigo-500/40 shadow-xl hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/20 blur-3xl group-hover:bg-cyan-400/20 transition-colors duration-500"></div>
              
              <div className="text-4xl mb-3 relative z-10 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{card.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{card.title}</h3>
              <p className="text-indigo-200/50 text-sm font-medium leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Start Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        >
          <button
            onClick={onStart}
            className="group relative px-12 py-4 rounded-full bg-transparent text-white font-black text-lg uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(99,102,241,0.4)] hover:shadow-[0_0_80px_rgba(99,102,241,0.6)] border border-indigo-400/50 overflow-hidden transition-all duration-500 hover:scale-[1.02]"
          >
            {/* Button Background Gradients */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-indigo-500"></div>
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
            
            {/* Moving Shimmer */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
            
            <span className="relative flex items-center justify-center drop-shadow-md">
              Initialize Protocol
              <span className="ml-4 transform group-hover:translate-x-2 transition-transform text-xl font-light">→</span>
            </span>
          </button>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}