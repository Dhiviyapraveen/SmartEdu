import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpaceShooterGame({ lesson, onComplete, onExit, onHitBlock }) {
  const [showContent, setShowContent] = useState(null);
  const [readBlocks, setReadBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const contents = lesson?.content || [
    "Fragment 1...", "Fragment 2...", "Fragment 3...", "Fragment 4...", "Fragment 5..."
  ];

  // Game Constants
  const GAME_WIDTH = 1100;
  const GAME_HEIGHT = 600;
  const PLAYER_SPEED = 7;
  const PROJECTILE_SPEED = 12;

  // Refs for physics
  const playerRef = useRef({ x: GAME_WIDTH / 2 - 25, y: GAME_HEIGHT - 80, width: 50, height: 50, vx: 0 });
  const keys = useRef({ left: false, right: false, space: false });
  const projectilesRef = useRef([]);
  const hasFired = useRef(false);

  // Generate Asteroids based on content length
  const enemiesRef = useRef(
    contents.map((_, i) => ({
      id: i,
      x: 150 + i * (GAME_WIDTH - 300) / (contents.length - 1 || 1),
      y: 80,
      width: 60,
      height: 60,
      vx: i % 2 === 0 ? 2 : -2, // Move left or right
      read: false,
      destroyed: false
    }))
  );

  const gateRef = useRef({
    x: GAME_WIDTH / 2 - 40,
    y: 50,
    width: 80,
    height: 80,
    active: false
  });

  // DOM Refs
  const playerElRef = useRef(null);
  const projectilesElRef = useRef(null);
  const enemiesElRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = true;
      if (e.key === " " || e.key === "Enter") keys.current.space = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = false;
      if (e.key === " " || e.key === "Enter") {
        keys.current.space = false;
        hasFired.current = false; // Reset firing
      }
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

    const gameLoop = () => {
      if (showContent || gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return; // paused
      }

      const p = playerRef.current;
      const projectiles = projectilesRef.current;
      const enemies = enemiesRef.current;

      // Player Movement
      if (keys.current.left) p.vx = -PLAYER_SPEED;
      else if (keys.current.right) p.vx = PLAYER_SPEED;
      else p.vx = 0;

      p.x += p.vx;
      if (p.x < 0) p.x = 0;
      if (p.x > GAME_WIDTH - p.width) p.x = GAME_WIDTH - p.width;

      // Shooting
      if (keys.current.space && !hasFired.current) {
        projectiles.push({
          x: p.x + p.width / 2 - 5,
          y: p.y,
          width: 10,
          height: 20,
          active: true
        });
        hasFired.current = true;
        if (onHitBlock) onHitBlock(); // Use click sound for laser
      }

      // Update Projectiles
      for (let i = 0; i < projectiles.length; i++) {
        const proj = projectiles[i];
        if (!proj.active) continue;
        proj.y -= PROJECTILE_SPEED;
        if (proj.y < -20) proj.active = false;
      }

      // Update Enemies
      enemies.forEach(e => {
        if (e.destroyed) return;
        
        // Patrol movement
        e.x += e.vx;
        if (e.x < 50 || e.x > GAME_WIDTH - 50 - e.width) {
          e.vx *= -1; // Bounce off edges
        }

        // Projectile Collision
        for (let j = 0; j < projectiles.length; j++) {
          const proj = projectiles[j];
          if (!proj.active) continue;
          
          if (
            proj.x < e.x + e.width &&
            proj.x + proj.width > e.x &&
            proj.y < e.y + e.height &&
            proj.y + proj.height > e.y
          ) {
            // Hit!
            proj.active = false;
            e.destroyed = true;
            if (onHitBlock) onHitBlock(); // Sound
            
            // Show content immediately
            if (!e.read) {
              e.read = true;
              setReadBlocks(prev => {
                if (!prev.includes(e.id)) {
                  setShowContent({ id: e.id, text: contents[e.id] });
                  if (prev.length + 1 >= 5) {
                    setTimeout(() => onComplete(), 2500);
                  }
                  return [...prev, e.id];
                }
                return prev;
              });
            }
          }
        }
      });

      // Cleanup inactive projectiles
      projectilesRef.current = projectiles.filter(p => p.active);

      // Gate Check
      if (readBlocks.length >= contents.length) {
        gateRef.current.active = true;
      }

      if (gateRef.current.active) {
        const g = gateRef.current;
        // Collision with gate
        if (
          p.x < g.x + g.width &&
          p.x + p.width > g.x &&
          p.y < g.y + g.height &&
          p.y + p.height > g.y
        ) {
          setGameOver(true);
          onComplete();
        }
      }

      // Force React to not render every frame by manually updating DOM bounds
      if (playerElRef.current) {
        playerElRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }

      if (projectilesElRef.current) {
        // We will just let React render projectiles if it's too complex to DOM diff, 
        // but for performance, we can just trigger a dummy state or use standard react rendering.
        // Since React state limits 60fps, we'll manually render children.
        const projHTML = projectilesRef.current.map(pr => 
          `<div style="position:absolute;left:${pr.x}px;top:${pr.y}px;width:${pr.width}px;height:${pr.height}px;background-color:#06b6d4;box-shadow:0 0 10px #06b6d4;border-radius:10px;"></div>`
        ).join('');
        projectilesElRef.current.innerHTML = projHTML;
      }

      if (enemiesElRef.current) {
        const enemiesHTML = enemiesRef.current.map(en => {
           if (en.destroyed) return '';
           return `<div style="position:absolute;left:${en.x}px;top:${en.y}px;width:${en.width}px;height:${en.height}px;font-size:40px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 10px rgba(168,85,247,0.5));">☄️</div>`;
        }).join('');
        enemiesElRef.current.innerHTML = enemiesHTML;
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
  }, [showContent, gameOver, readBlocks, contents, onComplete, onHitBlock]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 overflow-hidden p-4">
      <div 
        className="relative w-full max-w-[1100px] max-h-[90vh] aspect-video bg-[#020617] border-4 border-indigo-500/50 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] overflow-hidden"
      >
        {/* Starfield Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpIi8+PC9zdmc+')] animate-[pulse_4s_ease-in-out_infinite]"></div>

        {/* Dynamic DOM Containers */}
        <div ref={projectilesElRef} className="absolute inset-0 pointer-events-none"></div>
        <div ref={enemiesElRef} className="absolute inset-0 pointer-events-none"></div>

        {/* HyperGate */}
        {readBlocks.length >= contents.length && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full border-4 border-dashed border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.8)] flex items-center justify-center bg-cyan-900/40"
            style={{ 
              left: gateRef.current.x, 
              top: gateRef.current.y, 
              width: gateRef.current.width, 
              height: gateRef.current.height 
            }}
          >
            <span className="text-3xl">🌌</span>
          </motion.div>
        )}
        
        {/* Portal Text */}
        {readBlocks.length >= contents.length && (
          <div className="absolute text-cyan-300 font-bold tracking-widest uppercase animate-pulse" style={{ left: gateRef.current.x - 40, top: gateRef.current.y - 30 }}>
            Enter Hypergate
          </div>
        )}

        {/* Player Spaceship */}
        <div
          ref={playerElRef}
          className="absolute left-0 top-0 flex items-center justify-center text-5xl drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
          style={{ width: playerRef.current.width, height: playerRef.current.height, transform: `translate(${playerRef.current.x}px, ${playerRef.current.y}px)` }}
        >
          🚀
        </div>

        {/* HUD */}
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur px-6 py-2 rounded-xl font-bold text-cyan-300 border border-cyan-500/30">
          Asteroids Decoded: {readBlocks.length} / {contents.length}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/40 text-sm tracking-widest uppercase">
          [ ← → ] Move | [ SPACE ] Shoot | Fly into Hypergate to finish
        </div>

        <button 
          className="absolute top-4 right-4 bg-rose-500/80 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-transform hover:scale-105 border border-rose-400"
          onClick={onExit}
        >
          Abort Mission
        </button>

      </div>

      {/* Content Reading Modal */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute z-50 bg-[#0f172a] p-10 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.5)] max-w-2xl text-center border-2 border-indigo-400/50"
          >
            <h2 className="text-3xl font-bold mb-6 text-indigo-300 flex items-center justify-center">
              <span className="text-4xl mr-3">☄️</span>
              Data Fragment {showContent.id + 1}
            </h2>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 backdrop-blur-md">
              <p className="text-indigo-100 text-xl leading-relaxed text-left font-medium">
                {showContent.text}
              </p>
            </div>
            <button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] transition-all text-xl uppercase tracking-widest border border-indigo-400"
              onClick={() => setShowContent(null)}
            >
              Resume Flight
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
