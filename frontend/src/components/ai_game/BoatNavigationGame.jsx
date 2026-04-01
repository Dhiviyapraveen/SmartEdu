import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BoatNavigationGame({ lesson, onComplete, onExit, onHitBlock }) {
  const [showContent, setShowContent] = useState(null);
  const [readBlocks, setReadBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const contents = lesson?.content || [
    "Fragment 1...", "Fragment 2...", "Fragment 3...", "Fragment 4...", "Fragment 5..."
  ];

  const GAME_WIDTH = 1100;
  const GAME_HEIGHT = 600;
  const BOAT_WIDTH = 100;
  const BOAT_HEIGHT = 160;
  const SPEED = 10;

  const boatRef = useRef({ x: GAME_WIDTH / 2 - 30, y: GAME_HEIGHT - 150, width: BOAT_WIDTH, height: BOAT_HEIGHT });
  const keys = useRef({ left: false, right: false });
  const waterObjectsRef = useRef([]);

  const boatElRef = useRef(null);
  const waterObjectsElRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (showContent) {
      const utterance = new SpeechSynthesisUtterance(showContent.text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }

    let animationFrameId;
    let spawnTimer = 0;

    const gameLoop = () => {
      if (showContent || gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const b = boatRef.current;
      const objects = waterObjectsRef.current;

      // Boat Movement
      if (keys.current.left) b.x -= SPEED;
      if (keys.current.right) b.x += SPEED;

      // River Bounds (River is 800px wide, centered)
      const RIVER_LEFT = (GAME_WIDTH - 800) / 2;
      const RIVER_RIGHT = RIVER_LEFT + 800;
      
      if (b.x < RIVER_LEFT) b.x = RIVER_LEFT;
      if (b.x > RIVER_RIGHT - b.width) b.x = RIVER_RIGHT - b.width;

      // Spawn Objects (Buoys and Obstacles)
      spawnTimer++;
      if (spawnTimer > 60) {
        // Limit: Only 1 buoy on screen at a time, and total collected + on-screen cannot exceed 5
        const activeBuoys = objects.filter(o => o.isBuoy).length;
        const isBuoy = readBlocks.length + activeBuoys < 5 && activeBuoys === 0 && Math.random() < 0.4;
        objects.push({
          id: Date.now() + Math.random(),
          x: RIVER_LEFT + 50 + Math.random() * (700 - 40),
          y: -100,
          width: 50,
          height: 50,
          speed: 4 + Math.random() * 2,
          isBuoy,
          contentId: isBuoy ? readBlocks.length : null,
          active: true,
          type: isBuoy ? "buoy" : "rock"
        });
        spawnTimer = 0;
      }

      // Update Objects
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (!obj.active) continue;
        obj.y += obj.speed;

        // Collision Check
        if (
          obj.x < b.x + b.width &&
          obj.x + obj.width > b.x &&
          obj.y < b.y + b.height &&
          obj.y + obj.height > b.y
        ) {
          obj.active = false;
          if (onHitBlock) onHitBlock();

          if (obj.isBuoy && !readBlocks.includes(obj.contentId)) {
            setReadBlocks(prev => {
              const newRead = [...prev, obj.contentId];
              setShowContent({ id: obj.contentId, text: contents[obj.contentId] });
              
              // Automatically trigger completion after reading all 5
              if (newRead.length >= 5) {
                setTimeout(() => {
                  onComplete();
                }, 2500);
              }
              return newRead;
            });
          } else if (obj.type === "rock") {
            // Boat bonk - just push back slightly or flash
            b.x += (Math.random() - 0.5) * 40;
          }
        }

        if (obj.y > GAME_HEIGHT) obj.active = false;
      }

      waterObjectsRef.current = objects.filter(o => o.active);

      // DOM Rendering
      if (boatElRef.current) {
        boatElRef.current.style.transform = `translateX(${b.x}px)`;
      }

      if (waterObjectsElRef.current) {
        const objectsHTML = waterObjectsRef.current.map(o => 
          `<div style="position:absolute;left:${o.x}px;top:${o.y}px;width:${o.width}px;height:${o.height}px;font-size:40px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 10px ${o.isBuoy ? 'rgba(34,211,238,0.8)' : 'rgba(0,0,0,0.5)'});">
            ${o.isBuoy ? '🏮' : '🪨'}
          </div>`
        ).join('');
        waterObjectsElRef.current.innerHTML = objectsHTML;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      window.speechSynthesis.cancel();
    };
  }, [showContent, gameOver, readBlocks, contents, onHitBlock]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 overflow-hidden p-4">
      <div 
        className="relative w-full max-w-[1100px] max-h-[90vh] aspect-video bg-[#0c4a6e] border-4 border-white/20 rounded-2xl shadow-[0_0_60px_rgba(14,165,233,0.3)] overflow-hidden"
      >
        {/* River Banks */}
        <div className="absolute inset-y-0 left-0 w-[150px] bg-[#14532d] border-r-8 border-[#064e3b] shadow-inner">
           <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')]"></div>
           <div className="text-4xl p-4 flex flex-col gap-8 opacity-40">🌲 🌳 🌲 🌳</div>
        </div>
        <div className="absolute inset-y-0 right-0 w-[150px] bg-[#14532d] border-l-8 border-[#064e3b] shadow-inner">
           <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')]"></div>
           <div className="text-4xl p-4 flex flex-col gap-8 opacity-40 items-end">🌳 🌲 🌳 🌲</div>
        </div>

        {/* Animated Water Flow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           {Array.from({ length: 10 }).map((_, i) => (
             <motion.div
               key={i}
               className="absolute h-1 bg-white/40 rounded-full"
               initial={{ width: 40, x: 200 + Math.random() * 700, y: -50 }}
               animate={{ y: 700 }}
               transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
             />
           ))}
        </div>

        <div ref={waterObjectsElRef} className="absolute inset-0 pointer-events-none"></div>

        {/* Boat Character */}
        <motion.div
          ref={boatElRef}
          className="absolute bottom-[100px] flex items-center justify-center text-8xl drop-shadow-2xl z-10"
          style={{ 
            width: BOAT_WIDTH, 
            height: BOAT_HEIGHT, 
            transform: `translateX(${boatRef.current.x}px) rotate(-90deg)` 
          }}
          animate={{ y: [0, -8, 0], rotate: [-92, -88, -92] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🚤
        </motion.div>

        {/* HUD */}
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur px-6 py-2 rounded-xl font-bold text-sky-200 border border-sky-400/30">
          Knowledge Buoys Syncing: {readBlocks.length} / 5
        </div>

        {readBlocks.length >= 5 && (
          <motion.button
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            onClick={onComplete}
            className="absolute left-1/2 top-4 transform -translate-x-1/2 bg-sky-500 hover:bg-sky-400 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border border-sky-300 shadow-[0_0_40px_rgba(14,165,233,0.8)]"
          >
            Arrive at harbor →
          </motion.button>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase font-bold text-center">
           [ ← → ] Steer Boat | Collect 🏮 Buoys | Avoid 🪨 Rocks
        </div>

        <button 
          className="absolute top-4 right-4 bg-rose-500/80 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-transform hover:scale-105"
          onClick={onExit}
        >
          Abandon Vessel
        </button>
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="absolute z-50 bg-[#0f172a] p-10 rounded-3xl shadow-[0_0_50px_rgba(14,165,233,0.5)] max-w-2xl text-center border-2 border-sky-400/50"
          >
            <h2 className="text-3xl font-black mb-6 text-sky-400 tracking-tighter uppercase flex items-center justify-center">
              <span className="text-4xl mr-3 font-normal">🏮</span>
              Beacon Synchronized
            </h2>
            <div className="bg-sky-900/40 p-8 rounded-2xl border border-sky-500/20 mb-8 backdrop-blur-md">
              <p className="text-sky-100 text-xl leading-relaxed text-left font-medium">
                {showContent.text}
              </p>
            </div>
            <button
              className="bg-sky-600 hover:bg-sky-500 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border border-sky-400 shadow-lg"
              onClick={() => setShowContent(null)}
            >
              Resume Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
