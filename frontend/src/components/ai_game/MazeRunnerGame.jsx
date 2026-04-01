import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export default function MazeRunnerGame({ lesson, onComplete, onExit, onHitBlock }) {
  const [playerPos, setPlayerPos] = useState({ r: 1, c: 1 });
  const [showContent, setShowContent] = useState(null);
  const [readBlocks, setReadBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const contents = lesson?.content || [
    "Fragment 1...", "Fragment 2...", "Fragment 3...", "Fragment 4...", "Fragment 5..."
  ];

  const terminals = useRef([
    { r: 1, c: 5, id: 0 },
    { r: 3, c: 11, id: 1 },
    { r: 9, c: 1, id: 2 },
    { r: 7, c: 5, id: 3 },
    { r: 9, c: 13, id: 4 }
  ]);

  const exitPortal = useRef({ r: 5, c: 7 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showContent || gameOver) return;

      let nextR = playerPos.r;
      let nextC = playerPos.c;

      if (e.key === "ArrowUp" || e.key === "w") nextR--;
      if (e.key === "ArrowDown" || e.key === "s") nextR++;
      if (e.key === "ArrowLeft" || e.key === "a") nextC--;
      if (e.key === "ArrowRight" || e.key === "d") nextC++;

      if (MAZE[nextR] && MAZE[nextR][nextC] === 0) {
        setPlayerPos({ r: nextR, c: nextC });

        // Check Terminals
        const term = terminals.current.find(t => t.r === nextR && t.c === nextC);
        if (term && !readBlocks.includes(term.id)) {
          if (onHitBlock) onHitBlock();
          setReadBlocks([...readBlocks, term.id]);
          setShowContent({ id: term.id, text: contents[term.id] });
          if (readBlocks.length + 1 >= 5) {
            setTimeout(() => onComplete(), 2500);
          }
        }

        // Check Exit Portal
        if (readBlocks.length >= 5 && nextR === exitPortal.current.r && nextC === exitPortal.current.c) {
          setGameOver(true);
          onComplete();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, showContent, gameOver, readBlocks, contents, onHitBlock, onComplete]);

  useEffect(() => {
    if (showContent) {
      const utterance = new SpeechSynthesisUtterance(showContent.text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    return () => window.speechSynthesis.cancel();
  }, [showContent]);

  const CELL_SIZE = 40;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 p-4">
      <div className="relative bg-[#020617] border-4 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] p-6 max-h-[95vh] w-full max-w-4xl flex flex-col items-center overflow-y-auto">
        
        <div className="w-full flex justify-between items-center mb-6">
          <div className="bg-amber-500/10 border border-amber-500/30 px-6 py-2 rounded-xl">
            <span className="text-amber-400 font-bold tracking-widest uppercase">
              Terminals Accessed: {readBlocks.length} / 5
            </span>
          </div>
          <button 
            onClick={onExit}
            className="bg-rose-500/80 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-transform hover:scale-105 border border-rose-400"
          >
            Abort Protocol
          </button>
        </div>

        <h2 className="text-3xl font-black text-white mb-6">Cyber Maze Protocol</h2>

        <div className="relative bg-[#111827] border-2 border-white/5 rounded-xl p-4 shadow-inner">
          {MAZE.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  className={`flex items-center justify-center border border-white/[0.02] ${
                    cell === 1 ? 'bg-[#1F2937] shadow-inner' : 'bg-transparent'
                  }`}
                >
                  {/* Render Player */}
                  {playerPos.r === rIdx && playerPos.c === cIdx && (
                    <motion.div 
                      layoutId="player"
                      className="text-4xl z-20 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    >
                      🤖
                    </motion.div>
                  )}

                  {/* Render Terminals */}
                  {terminals.current.some(t => t.r === rIdx && t.c === cIdx) && !readBlocks.includes(terminals.current.find(t => t.r === rIdx && t.c === cIdx).id) && (
                    <div className="text-2xl animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                      🖥️
                    </div>
                  )}

                  {/* Render Exit Portal */}
                  {readBlocks.length >= 5 && exitPortal.current.r === rIdx && exitPortal.current.c === cIdx && (
                    <motion.div 
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-4xl drop-shadow-[0_0_15px_rgba(168,85,247,1)]"
                    >
                      🌀
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 text-amber-200/40 text-xs tracking-widest uppercase font-bold flex gap-4">
          <span>Arrows / WASD to Move</span>
          <span>Find All 💻 Terminals</span>
          <span>Enter 🌀 to Finish</span>
        </div>
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            className="absolute z-50 bg-[#0f172a] p-10 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.4)] max-w-2xl text-center border-2 border-amber-500/50"
          >
            <h2 className="text-3xl font-black mb-6 text-amber-400 tracking-tighter uppercase">Terminal Uplink Established</h2>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-8 backdrop-blur-md">
              <p className="text-amber-100 text-xl leading-relaxed text-left font-mono">
                {showContent.text}
              </p>
            </div>
            <button
              className="bg-amber-600 hover:bg-amber-500 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border border-amber-400 shadow-lg"
              onClick={() => setShowContent(null)}
            >
              Resume Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
