import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYMBOLS = ["🧠", "🤖", "⚡", "🔬", "🛰️", "🧬", "💻", "🌐"];

export default function MemoryMatchGame({ lesson, onComplete, onExit, onHitBlock }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showContent, setShowContent] = useState(null);
  const [readBlocks, setReadBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const contents = lesson?.content || [
    "Fragment 1...", "Fragment 2...", "Fragment 3...", "Fragment 4...", "Fragment 5..."
  ];

  useEffect(() => {
    // Initialize cards: 5 pairs for the 5 content fragments + 3 extra pairs for difficulty
    const gamePairs = SYMBOLS.slice(0, 5);
    const extraPairs = SYMBOLS.slice(5, 8);
    const allPairs = [...gamePairs, ...extraPairs];
    const deck = [];
    
    allPairs.forEach((symbol, index) => {
      deck.push({ id: index * 2, symbol, contentId: index < 5 ? index : null });
      deck.push({ id: index * 2 + 1, symbol, contentId: index < 5 ? index : null });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].symbol === cards[second].symbol) {
        const newMatched = [...matched, cards[first].symbol];
        setMatched(newMatched);
        setFlipped([]);
        if (onHitBlock) onHitBlock(); // Success sound

        // If it's a content pair, show the reading modal
        if (cards[first].contentId !== null) {
          const cid = cards[first].contentId;
          setReadBlocks(prev => {
            if (!prev.includes(cid)) {
              setShowContent({ id: cid, text: contents[cid] });
              return [...prev, cid];
            }
            return prev;
          });
        }
      } else {
        const timer = setTimeout(() => setFlipped([]), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flipped, cards, matched, contents, onHitBlock]);

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

  const handleCardClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(cards[index].symbol)) {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 p-4">
      <div className="relative bg-[#0F172A] border-4 border-emerald-500/50 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 max-h-[95vh] w-full max-w-4xl flex flex-col items-center overflow-y-auto">
        
        <div className="w-full flex justify-between items-center mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-2 rounded-xl">
            <span className="text-emerald-400 font-bold tracking-widest uppercase">
              Synaptic Links: {readBlocks.length} / 5
            </span>
          </div>
          <button 
            onClick={onExit}
            className="bg-rose-500/80 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-transform hover:scale-105 border border-rose-400"
          >
            Abort Matrix
          </button>
        </div>

        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Neural Memory Match</h2>
        <p className="text-emerald-200/50 mb-8 uppercase tracking-[0.2em] text-xs font-bold">Connect the data pairs to unlock fragments</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(card.symbol);
            return (
              <motion.div
                key={card.id}
                whileHover={!isFlipped ? { scale: 1.05 } : {}}
                whileTap={!isFlipped ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(index)}
                className={`w-20 h-28 md:w-28 md:h-36 rounded-2xl cursor-pointer transition-all duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border-2 flex items-center justify-center text-4xl shadow-lg transition-colors ${
                  matched.includes(card.symbol)
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-white/5 border-white/10 text-white/20'
                }`}
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {isFlipped ? card.symbol : "?"}
                </div>
                {!isFlipped && (
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 border-2 border-white/20 flex items-center justify-center shadow-xl">
                    <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center">
                      <span className="text-white/20 text-xs font-black">AI</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {readBlocks.length >= 5 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border-2 border-emerald-400 shadow-lg"
          >
            Access Quiz Core →
          </motion.button>
        )}

        <div className="mt-8 text-white/30 text-xs tracking-widest uppercase font-bold">
          Match the 5 primary data pairs to proceed
        </div>
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 bg-[#020617] p-10 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.4)] max-w-2xl text-center border-2 border-emerald-500/50"
          >
            <h2 className="text-3xl font-black mb-6 text-emerald-400 tracking-tight uppercase">Fragment Synchronized</h2>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-8 backdrop-blur-md">
              <p className="text-indigo-100 text-xl leading-relaxed text-left font-medium italic">
                "{showContent.text}"
              </p>
            </div>
            <button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-12 rounded-2xl transition-all text-xl uppercase tracking-widest border border-emerald-400 shadow-lg"
              onClick={() => setShowContent(null)}
            >
              Continue Sync
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .backface-hidden { backface-visibility: hidden; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
