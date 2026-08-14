import React from "react";
import { motion } from "framer-motion";

function Progress({ index, numQuestions, points, totalPoints, answer }) {
  const currentStep = index + Number(answer !== null);
  const percentage = Math.min(100, Math.max(0, (currentStep / numQuestions) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto mb-5 glass-card p-3.5 sm:p-4 flex flex-col gap-3 shadow-xl border-slate-200 dark:border-white/15 bg-white/90 dark:bg-card rounded-2xl"
    >
      {/* Custom Neon Progress Rail */}
      <div className="relative w-full h-3.5 rounded-full bg-slate-200 dark:bg-[#0a0d16] border border-slate-300 dark:border-white/10 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-teal-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] relative"
        >
          {/* Animated pulse tip */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[2px] animate-pulse" />
        </motion.div>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold px-1">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="px-2.5 py-1 rounded-xl bg-violet-100 dark:bg-violet-500/15 border border-violet-300 dark:border-violet-500/30 text-violet-900 dark:text-violet-300 text-xs uppercase tracking-wider font-black">
            Progress
          </span>
          <span className="text-slate-900 dark:text-white text-sm">
            Question <strong className="text-cyan-800 dark:text-cyan-300">{index + 1}</strong> of {numQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-300 text-xs uppercase tracking-wider font-black shadow-sm">
            Team Score
          </span>
          <span className="text-slate-900 dark:text-white font-black text-sm sm:text-base">
            <strong className="text-amber-950 dark:text-amber-300">{Math.ceil(points)}</strong> pts
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default Progress;
