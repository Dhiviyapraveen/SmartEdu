import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlatformerGame({ lesson, onComplete, onExit, onHitBlock }) {
  // states
  const [showContent, setShowContent] = useState(null);
  const [readBlocks, setReadBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Read content string array from lesson
  const contents = lesson?.content || [
    "Artificial Intelligence (AI) refers to the development of computer systems...",
    "Machine learning is a subset of AI that involves the use of algorithms...",
    "There are several applications of AI...",
    "Computer vision is a subset of AI...",
    "The future of AI holds many possibilities..."
  ];

  // physics constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const SPEED = 6;
  const GROUND_Y = 400;

  const playerRef = useRef({
    x: 50, y: GROUND_Y, vx: 0, vy: 0, 
    width: 40, height: 40, 
    isJumping: false, isCrouching: false
  });

  const keys = useRef({ left: false, right: false, up: false, down: false });

  // Generate blocks based on content length
  const blocksRef = useRef(
    contents.map((_, i) => ({
      id: i,
      x: 180 + i * 140, // Space them out
      y: 250,
      width: 50,
      height: 50,
      read: false
    }))
  );

  const doorRef = useRef({
    x: 180 + contents.length * 140,
    y: GROUND_Y - 20, // Door is taller
    width: 60,
    height: 60,
    active: false
  });

  // references to DOM for manual style updates to avoid React render lag
  const playerElementRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") keys.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s") keys.current.down = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") keys.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s") keys.current.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationFrameId;

    // Speech synthesis for content reading
    if (showContent) {
      const utterance = new SpeechSynthesisUtterance(showContent.text);
      utterance.rate = 0.9; // slightly slower for readability
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }

    const gameLoop = () => {
      if (showContent || gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return; // paused
      }

      const p = playerRef.current;

      // Horizontal movement
      if (keys.current.left) p.vx = -SPEED;
      else if (keys.current.right) p.vx = SPEED;
      else p.vx = 0;

      // Crouching
      if (keys.current.down && !p.isJumping) {
        p.isCrouching = true;
        p.height = 20;
        p.y = GROUND_Y + 20; // visually move down
        p.vx = 0; // stop moving while crouching
      } else {
        if (p.isCrouching && p.y === GROUND_Y + 20) {
          p.y = GROUND_Y;
        }
        p.isCrouching = false;
        p.height = 40;
      }

      // Jumping
      if (keys.current.up && !p.isJumping) {
        p.vy = JUMP_FORCE;
        p.isJumping = true;
      }

      // Apply physics
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;

      // Floor collision
      const currentFloor = p.isCrouching ? GROUND_Y + 20 : GROUND_Y;
      if (p.y >= currentFloor) {
        p.y = currentFloor;
        p.vy = 0;
        p.isJumping = false;
      }

      // Screen bounds
      if (p.x < 0) p.x = 0;
      if (p.x > 1050) p.x = 1050; // Assuming game container width ~1100, player width 40

      // Block collisions
      blocksRef.current.forEach((b) => {
        // AABB Collision
        if (
          p.x < b.x + b.width &&
          p.x + p.width > b.x &&
          p.y < b.y + b.height &&
          p.y + p.height > b.y
        ) {
          // Bottom collision (hitting block from below)
          if (p.vy <= 0 && p.y > b.y + b.height / 2) {
            p.y = b.y + b.height;
            p.vy = GRAVITY; // Bonk head and fall
            
            // Only trigger if character jumped into it
            if (!b.read) {
              b.read = true;
              if (onHitBlock) onHitBlock(); // Play sound
              // Must update state immediately without waiting for next frame otherwise we trigger multiple times
              setReadBlocks(prev => {
                if (!prev.includes(b.id)) {
                  setShowContent({ id: b.id, text: contents[b.id] });
                  if (prev.length + 1 >= 5) {
                    setTimeout(() => onComplete(), 2500);
                  }
                  return [...prev, b.id];
                }
                return prev;
              });
            }
          }
          // Top collision (landing on block)
          else if (p.vy > 0 && p.y + p.height < b.y + b.height / 2) {
            p.y = b.y - p.height;
            p.vy = 0;
            p.isJumping = false;
          }
          // Side collisions
          else {
            if (p.vx > 0) p.x = b.x - p.width; // hit left side
            else if (p.vx < 0) p.x = b.x + b.width; // hit right side
          }
        }
      });

      // Door collision Check (only if spawned)
      if (readBlocks.length >= contents.length) {
        doorRef.current.active = true;
      }

      if (doorRef.current.active) {
        const d = doorRef.current;
        if (
          p.x < d.x + d.width &&
          p.x + p.width > d.x &&
          p.y < d.y + d.height &&
          p.y + p.height > d.y
        ) {
          setGameOver(true);
          onComplete(); // Triggers the quiz
        }
      }

      // DOM update
      if (playerElementRef.current) {
        playerElementRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`;
        playerElementRef.current.style.height = `${p.height}px`;
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 overflow-hidden p-4">
      <div className="relative w-full max-w-[1100px] max-h-[90vh] aspect-video bg-sky-300 border-4 border-white rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Sky / Background elements */}
        <div className="absolute top-10 left-20 text-6xl opacity-70">☁️</div>
        <div className="absolute top-24 right-40 text-7xl opacity-50">☁️</div>
        
        {/* Ground */}
        <div 
          className="absolute bottom-0 w-full h-[160px] bg-green-500 border-t-8 border-green-700 shadow-inner"
          style={{ top: GROUND_Y + 40 }} 
        >
          {/* Ground pattern */}
          <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* Blocks */}
        {blocksRef.current.map((b) => (
          <div
            key={b.id}
            className={`absolute flex items-center justify-center text-3xl font-bold rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.2)] border-b-4 border-r-4 ${
              readBlocks.includes(b.id) 
                ? "bg-amber-800 border-amber-950 text-amber-900" 
                : "bg-yellow-400 border-yellow-600 text-yellow-800"
            }`}
            style={{ left: b.x, top: b.y, width: b.width, height: b.height }}
          >
            {readBlocks.includes(b.id) ? "" : "?"}
          </div>
        ))}

        {/* Instructions */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white font-bold opacity-60 text-lg">
          Use ← → to move, ↑ to jump, ↓ to duck. Hit all ? blocks!
        </div>

        {/* Internal Door (spawns when all read) */}
        {readBlocks.length >= contents.length && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute bg-amber-900 border-4 border-amber-950 rounded-t-lg shadow-xl flex items-center justify-center"
            style={{ 
              left: doorRef.current.x, 
              top: doorRef.current.y, 
              width: doorRef.current.width, 
              height: doorRef.current.height 
            }}
          >
            <span className="text-4xl animate-pulse">🚪</span>
            <div className="absolute -top-8 text-white font-bold bg-black/80 px-2 py-1 rounded text-sm whitespace-nowrap">
              Enter to take Quiz!
            </div>
          </motion.div>
        )}

        {/* Player Character */}
        <div
          ref={playerElementRef}
          className="absolute left-0 top-0 w-[40px] flex items-center justify-center text-4xl transform scale-x-100"
          style={{ height: '40px', transform: 'translate(50px, 400px)' }}
        >
          🤖
        </div>

        {/* HUD */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-6 py-2 rounded-xl font-bold shadow-md text-sky-900 border-2 border-sky-200">
          Intel Gathered: {readBlocks.length} / {contents.length}
        </div>

        <button 
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 shadow-md transition-transform hover:scale-105"
          onClick={onExit}
        >
          Exit Level
        </button>

      </div>

      {/* Content Reading Modal */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute z-50 bg-white p-10 rounded-3xl shadow-2xl max-w-2xl text-center border-4 border-blue-500"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-700 flex items-center justify-center">
              <span className="text-4xl mr-3">💡</span>
              Phase {showContent.id + 1}
            </h2>
            <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 mb-8">
              <p className="text-sky-900 text-xl leading-relaxed text-left font-medium">
                {showContent.text}
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl shadow-[0_5px_0_rgb(16,185,129)] hover:shadow-[0_2px_0_rgb(16,185,129)] hover:translate-y-[3px] transition-all text-xl"
              onClick={() => setShowContent(null)}
            >
              Resume Mission
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
