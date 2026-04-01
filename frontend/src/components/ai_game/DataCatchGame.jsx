import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DataCatchGame({ lesson, onComplete, onExit, onHitBlock }) {
  const [showContent, setShowContent] = useState(null);
  const [readBlocks, setReadBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const contents = lesson?.content || [
    "Fragment 1...", "Fragment 2...", "Fragment 3...", "Fragment 4...", "Fragment 5..."
  ];

  const GAME_WIDTH = 1100;
  const GAME_HEIGHT = 600;
  const BASKET_WIDTH = 120;
  const BASKET_HEIGHT = 40;
  const SPEED = 12;

  const basketRef = useRef({ x: GAME_WIDTH / 2 - 60, y: GAME_HEIGHT - 60, width: BASKET_WIDTH, height: BASKET_HEIGHT });
  const keys = useRef({ left: false, right: false });
  const dropletsRef = useRef([]);

  const basketElRef = useRef(null);
  const dropletsElRef = useRef(null);

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

      const b = basketRef.current;
      const droplets = dropletsRef.current;

      // Basket Movement
      if (keys.current.left) b.x -= SPEED;
      if (keys.current.right) b.x += SPEED;

      if (b.x < 0) b.x = 0;
      if (b.x > GAME_WIDTH - b.width) b.x = GAME_WIDTH - b.width;

      // Spawn Droplets
      spawnTimer++;
      if (spawnTimer > 40) {
        // Only spawn a target droplet if we haven't read all
        const allTargets = readBlocks.length >= 5;
        const isTarget = !allTargets && Math.random() < 0.2;
        droplets.push({
          id: Date.now() + Math.random(),
          x: Math.random() * (GAME_WIDTH - 40),
          y: -40,
          width: 40,
          height: 40,
          speed: 4 + Math.random() * 4,
          isTarget,
          contentId: isTarget ? readBlocks.length : null,
          active: true
        });
        spawnTimer = 0;
      }

      // Update Droplets
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        if (!d.active) continue;
        d.y += d.speed;

        // Collision Check
        if (
          d.x < b.x + b.width &&
          d.x + d.width > b.x &&
          d.y < b.y + b.height &&
          d.y + d.height > b.y
        ) {
          d.active = false;
          if (onHitBlock) onHitBlock();

          if (d.isTarget && !readBlocks.includes(d.contentId)) {
            setReadBlocks(prev => {
              const newRead = [...prev, d.contentId];
              setShowContent({ id: d.contentId, text: contents[d.contentId] });
              
              // Automatically trigger completion after reading all 5
              if (newRead.length >= 5) {
                setTimeout(() => {
                  onComplete();
                }, 2500);
              }
              return newRead;
            });
          }
        }

        if (d.y > GAME_HEIGHT) d.active = false;
      }

      dropletsRef.current = droplets.filter(d => d.active);

      // DOM Manual Rendering
      if (basketElRef.current) {
        basketElRef.current.style.transform = `translateX(${b.x}px)`;
      }

      if (dropletsElRef.current) {
        const dropletsHTML = dropletsRef.current.map(dr => 
          `<div style="position:absolute;left:${dr.x}px;top:${dr.y}px;width:${dr.width}px;height:${dr.height}px;font-size:32px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 10px ${dr.isTarget ? 'rgba(251,191,36,0.8)' : 'rgba(125,211,252,0.4)'});">
            ${dr.isTarget ? '⭐' : '💧'}
          </div>`
        ).join('');
        dropletsElRef.current.innerHTML = dropletsHTML;
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
        className="relative w-full max-w-[1100px] max-h-[90vh] aspect-video bg-[#020617] border-4 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]"></div>
        
        <div ref={dropletsElRef} className="absolute inset-0 pointer-events-none"></div>

        <div
          ref={basketElRef}
          className="absolute bottom-6 h-[40px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 border-2 border-white/20 shadow-[0_0_20px_rgba(6,182,212,0.8)] flex items-center justify-center p-2"
          style={{ width: BASKET_WIDTH, transform: `translateX(${basketRef.current.x}px)` }}
        >
          <div className="w-full h-2 bg-white/20 rounded-full animate-pulse"></div>
        </div>

        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur px-6 py-2 rounded-xl font-bold text-cyan-300 border border-cyan-500/30">
          Data Packets Synthesized: {readBlocks.length} / 5
        </div>

        {readBlocks.length >= 5 && (
          <motion.button
            initial={{ y: 0, scale: 0 }}
            animate={{ y: -300, scale: 1 }}
            onClick={onComplete}
            className="absolute left-1/2 bottom-0 transform -translate-x-1/2 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.8)]"
          >
            Activate Quiz Interface →
          </motion.button>
        )}

        <div className="absolute bottom-4 left-4 text-white/40 text-xs tracking-widest uppercase font-bold">
           [ ← → ] Move Server | Catch Golden ⭐ Knowledge Packets
        </div>

        <button 
          className="absolute top-4 right-4 bg-rose-500/80 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-transform hover:scale-105"
          onClick={onExit}
        >
          Shutdown System
        </button>
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="absolute z-50 bg-[#0f172a] p-10 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.5)] max-w-2xl text-center border-2 border-cyan-400/50"
          >
            <h2 className="text-3xl font-black mb-6 text-cyan-400 tracking-tighter uppercase">Data Stream Captured</h2>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-8 backdrop-blur-md">
              <p className="text-cyan-100 text-xl leading-relaxed text-left font-medium">
                {showContent.text}
              </p>
            </div>
            <button
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border border-cyan-400 shadow-lg"
              onClick={() => setShowContent(null)}
            >
              Resume Stream
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
