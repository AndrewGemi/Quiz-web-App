import React from "react";
import { motion } from "framer-motion";
import { balanceQuestionsByPoints } from "../utils/excelHelper";

function CategorySelection({
  categories,
  onSelect,
  onBack,
  completedCategories = [],
  teams = [],
  examMode = "trial",
}) {
  if (!categories || categories.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-slate-400 max-w-md mx-auto my-8">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading categories...
      </div>
    );
  }

  const completedCount = completedCategories.length;
  const totalCount = categories.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center"
    >
      {/* Top Navigation & Match Roster Summary */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-700 dark:border-purple-500/30 text-white dark:text-purple-200 font-black text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>⬅</span>
            <span className="text-white">Back to Team Setup</span>
          </motion.button>
        )}

        {/* Registered Teams Quick Summary */}
        {teams && teams.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-900 dark:bg-purple-950/70 border border-purple-700 dark:border-purple-500/30 text-xs font-black text-white dark:text-purple-200 shadow-sm">
            <span className="text-white dark:text-purple-200 font-black">
              👥 {teams.length} Competing Teams:
            </span>
            <div className="flex items-center gap-1.5 truncate max-w-xs sm:max-w-md">
              {teams.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-purple-950 dark:bg-purple-900/80 border border-purple-700/60 dark:border-purple-500/40 text-white font-black truncate"
                >
                  {typeof t === "string" ? t : t.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hero Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-emerald-600 border border-emerald-500 mb-4 shadow-md">
          Stage 3 • Topic Selection ({completedCount}/{totalCount} Completed)
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-3">
          Select <span className="text-gradient-cyan">Category Round</span>
        </h1>
        <p className="text-slate-950 dark:text-purple-200 text-lg sm:text-xl font-bold max-w-2xl">
          Choose a battleground category. Each team gets an equal turn!
        </p>

        {/* Global Progress Bar */}
        <div className="w-full max-w-md mx-auto mt-6">
          <div className="flex justify-between text-xs font-black text-slate-950 dark:text-purple-200 uppercase mb-2">
            <span>Tournament Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="h-3 w-full bg-slate-200 dark:bg-purple-950/60 rounded-full border border-purple-300 dark:border-purple-500/30 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.7)]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Categories (Widescreen Multi-column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {categories.map((category, index) => {
          const done =
            completedCategories.includes(category.title) ||
            completedCategories.includes(index) ||
            completedCategories.includes(category);
          const icon = category.type === "complete" ? "✏️" : "🔘";
          const numTeams = teams?.length || 1;
          const rawQuestions = category.questions || [];
          const usableQuestions = balanceQuestionsByPoints(rawQuestions, numTeams, false);
          const qCount = usableQuestions.length || rawQuestions.length;
          const totalPts = usableQuestions.reduce(
            (acc, q) => acc + (typeof q.points === "number" ? q.points : 10),
            0
          );

          return (
            <motion.button
              key={category.title || index}
              disabled={done}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={done ? {} : { y: -6, scale: 1.02 }}
              whileTap={done ? {} : { scale: 0.98 }}
              onClick={() => onSelect(category)}
              className={[
                "glass-card p-7 flex flex-col justify-between text-left transition-all duration-300 relative overflow-hidden group min-h-[230px] rounded-3xl",
                done
                  ? "opacity-60 border-slate-300 dark:border-white/5 bg-slate-100/80 dark:bg-white/[0.02] cursor-not-allowed"
                  : "border-2 border-purple-200/90 dark:border-purple-500/30 hover:border-cyan-500 hover:shadow-[0_20px_40px_rgba(6,182,212,0.22)] dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] cursor-pointer bg-white/95 dark:bg-[#120826]/95",
              ].join(" ")}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">
                      {icon}
                    </span>
                    <span className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-cyan-950 dark:text-cyan-400 font-black text-lg shrink-0">
                      L{index + 1}
                    </span>
                  </div>

                  <span
                    className={[
                      "text-xs font-black px-3.5 py-1.5 rounded-full border shadow-sm",
                      done
                        ? "bg-slate-400 text-white border-slate-400"
                        : "bg-cyan-600 text-white border-cyan-500",
                    ].join(" ")}
                  >
                    {done ? "✓ Completed" : "Unlocked"}
                  </span>
                </div>

                {/* Category Title & Description */}
                <h3
                  dir="auto"
                  className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors mb-2 leading-snug"
                >
                  {category.title}
                </h3>
                {category.description && (
                  <p
                    dir="auto"
                    className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 font-medium mb-3"
                  >
                    {category.description}
                  </p>
                )}
              </div>

              {/* Bottom Meta Tags */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-purple-500/20 text-xs font-black flex-wrap">
                {/* Questions Tag: Pure white text */}
                <span className="px-2.5 py-1 rounded-lg bg-purple-900 dark:bg-purple-950/60 border border-purple-700 dark:border-purple-500/30 text-white dark:text-purple-200 font-black shadow-xs">
                  📝 {qCount} Questions
                </span>

                {/* Points Tag: High-contrast dark amber text */}
                {totalPts > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-600 font-black shadow-xs">
                    ⭐ {totalPts} Total Pts
                  </span>
                )}

                {/* Format Tag: Deep Dark Cyan/Teal with Pure White Text */}
                <span className="px-2.5 py-1 rounded-lg bg-cyan-900 dark:bg-cyan-950/70 border border-cyan-700 dark:border-cyan-500/30 text-white dark:text-cyan-200 font-black shadow-xs">
                  {category.type === "complete" ? "✏️ Fill Blanks" : "🔘 Multiple Choice"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default CategorySelection;
