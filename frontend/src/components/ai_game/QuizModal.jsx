import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizModal({ isOpen, lesson, onClose }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setShowResult(false);
    }
  }, [isOpen]);

  if (!isOpen || !lesson) return null;

  const quiz = lesson.quizzes[current];
  const progress = ((current + 1) / lesson.quizzes.length) * 100;

  const handleOptionSelect = (index) => {
    if (showResult) return;
    setSelected(index);
  };

  const handleNext = () => {
    if (showResult) {
      setShowResult(false);
      setSelected(null);
      if (current < lesson.quizzes.length - 1) {
        setCurrent(current + 1);
      } else {
        onClose(score);
      }
      return;
    }

    const correct = selected === quiz.correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-hidden"
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen"
              animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-rose-600/20 rounded-full blur-3xl mix-blend-screen"
              animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_rgba(79,70,229,0.3)] border border-white/10 max-w-2xl w-full max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-5 border-b border-white/10 flex-shrink-0 bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"></div>
              <div className="relative flex items-center justify-between">
                <h2 className="text-2xl font-extrabold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
                  <span className="text-3xl mr-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" style={{ WebkitTextFillColor: 'initial' }}>🌌</span>
                  {lesson.title}
                </h2>
                
                <div className="text-right flex space-x-6 items-center">
                  {lesson.xp && (
                    <div className="text-center group">
                      <div className="text-[10px] uppercase tracking-widest text-amber-200/80 mb-0.5">XP Reward</div>
                      <div className="text-xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">+{lesson.xp}</div>
                    </div>
                  )}
                  <div className="text-center group">
                    <div className="text-[10px] uppercase tracking-widest text-cyan-200/80 mb-0.5">Score</div>
                    <div className="text-xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                      {score}<span className="text-cyan-600/60">/{lesson.quizzes.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seamless Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="text-[10px] font-bold tracking-widest text-indigo-400/80 uppercase mb-2">
                Question {current + 1} of {lesson.quizzes.length}
              </div>
              
              {/* Question */}
              <motion.div
                key={`q-${current}`}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-white leading-tight tracking-wide drop-shadow-md">
                  {quiz.q}
                </h3>
              </motion.div>
 
              {/* Options */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {quiz.options.map((option, index) => {
                  let optionClass = "w-full p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group flex items-center ";
                  let textClass = "font-semibold text-base z-10 relative transition-colors duration-300 ";

                  if (showResult) {
                    if (index === quiz.correct) {
                      optionClass += "bg-emerald-500/20 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]";
                      textClass += "text-emerald-300";
                    } else if (index === selected && index !== quiz.correct) {
                      optionClass += "bg-rose-500/10 border-rose-500/50";
                      textClass += "text-rose-400/80";
                    } else {
                      optionClass += "bg-white/5 border-white/5 opacity-50";
                      textClass += "text-white/40";
                    }
                  } else {
                    if (selected === index) {
                      optionClass += "bg-indigo-500/40 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.4)] transform scale-[1.02]";
                      textClass += "text-indigo-100";
                    } else {
                      optionClass += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-[1.01]";
                      textClass += "text-gray-300 group-hover:text-white";
                    }
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      className={optionClass}
                      onClick={() => handleOptionSelect(index)}
                    >
                      {/* Interactive Selection Ring */}
                      <div className={`w-6 h-6 rounded-full border-2 mr-5 flex flex-shrink-0 items-center justify-center transition-all duration-300 ${
                        selected === index
                          ? showResult
                            ? index === quiz.correct
                              ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                              : 'bg-rose-500 border-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.8)]'
                            : 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-110'
                          : showResult && index === quiz.correct 
                            ? 'bg-emerald-500/50 border-emerald-400/50'
                            : 'border-gray-500 group-hover:border-indigo-400/50'
                      }`}>
                        {selected === index && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5 bg-white rounded-full"
                          />
                        )}
                      </div>

                      <span className={textClass}>{option}</span>
                      
                      {/* Result Icons */}
                      {showResult && index === quiz.correct && (
                        <motion.span 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="ml-auto text-emerald-400 text-2xl font-black drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        >✓</motion.span>
                      )}
                      {showResult && index === selected && index !== quiz.correct && (
                        <motion.span 
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="ml-auto text-rose-400 text-2xl font-black drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]"
                        >✗</motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Result Message Container */}
              <AnimatePresence mode="wait">
                {showResult && (
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.95 }}
                    className={`text-center p-5 rounded-xl mb-2 backdrop-blur-xl border ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    <div className={`text-xl font-black mb-1 tracking-widest uppercase drop-shadow-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrect ? '✨ Correct ✨' : '💥 Incorrect 💥'}
                    </div>
                    <div className={`text-sm font-medium ${isCorrect ? 'text-emerald-200' : 'text-rose-200'}`}>
                      {isCorrect
                        ? 'Great job! Your neural pathways are aligning perfectly.'
                        : (
                          <>
                            <span className="opacity-80">Correct answer: </span>
                            <span className="font-bold text-white ml-2">{quiz.options[quiz.correct]}</span>
                          </>
                        )
                      }
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Next Button */}
            <div className="flex-shrink-0 p-5 border-t border-white/10 bg-black/20 backdrop-blur-md">
              <div className="flex justify-center">
                <motion.button
                  whileHover={showResult || selected !== null ? { scale: 1.02, boxShadow: "0 0 20px rgba(99,102,241,0.4)" } : {}}
                  whileTap={showResult || selected !== null ? { scale: 0.98 } : {}}
                  onClick={handleNext}
                  disabled={!showResult && selected === null}
                  className={`w-full max-w-sm py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all duration-300 ${
                    showResult || selected !== null
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white border border-white/20'
                      : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {showResult
                    ? current === lesson.quizzes.length - 1
                      ? '🏆 Finish'
                      : 'Next →'
                    : 'Select Answer'
                  }
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22d3ee, #6366f1);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #67e8f9, #818cf8);
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </AnimatePresence>
  );
}