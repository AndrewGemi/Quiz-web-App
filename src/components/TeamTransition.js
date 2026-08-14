import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BADGES = [
  { rank: 1, icon: "🥇", label: "1st Place", bg: "from-amber-200/90 via-yellow-100/90 to-amber-200/90 dark:from-amber-500/30 dark:to-yellow-500/10 border-amber-400 text-amber-950 dark:text-amber-300", shadow: "shadow-[0_4px_20px_rgba(245,158,11,0.25)] dark:shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50" },
  { rank: 2, icon: "🥈", label: "2nd Place", bg: "from-slate-100 to-slate-200/60 dark:from-slate-400/30 dark:to-slate-500/10 border-slate-300 text-slate-800 dark:text-slate-200", shadow: "shadow-[0_4px_15px_rgba(203,213,225,0.25)] dark:shadow-[0_0_20px_rgba(203,213,225,0.25)]" },
  { rank: 3, icon: "🥉", label: "3rd Place", bg: "from-amber-100/70 to-orange-100/60 dark:from-amber-700/30 dark:to-amber-800/10 border-amber-300 text-amber-900 dark:text-amber-400", shadow: "shadow-[0_4px_15px_rgba(217,119,6,0.2)] dark:shadow-[0_0_15px_rgba(217,119,6,0.25)]" },
];

const DEFAULT_AVATARS = ["⚡", "🚀", "🔥", "👑", "💎", "🎯", "🌟", "🛡️"];

function TeamTransition({
  team,
  teams = [],
  points = {},
  totalPoints = {},
  index = 0,
  numQuestions = 0,
  onContinue,
}) {
  const [stage, setStage] = useState("leaderboard"); // "leaderboard" | "turnAnnouncement"

  // Sort teams by total points descending
  const sortedLeaderboard = (teams || [])
    .map((teamName, idx) => {
      const currentScore = Number(points?.[teamName]) || 0;
      const accumScore = Number(totalPoints?.[teamName]) || 0;
      const totalScore = currentScore + accumScore;
      const avatar = DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
      return {
        name: teamName,
        currentScore,
        accumScore,
        totalScore,
        avatar,
        isCurrentUpNext: teamName === team,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const maxScore = Math.max(...sortedLeaderboard.map((t) => t.totalScore), 1);
  const nextTeamData = sortedLeaderboard.find((t) => t.name === team) || {
    name: team,
    avatar: "🎯",
    totalScore: points?.[team] || 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 dark:bg-black/85 backdrop-blur-xl overflow-y-auto">
      <AnimatePresence mode="wait">
        {stage === "leaderboard" ? (
          /* ============= STAGE 1: LEADERBOARD STANDINGS ============= */
          <motion.div
            key="stage-leaderboard"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl glass-card p-6 sm:p-8 border-2 border-purple-300/80 dark:border-purple-500/40 shadow-[0_20px_60px_rgba(124,58,237,0.25)] dark:shadow-[0_0_60px_rgba(139,92,246,0.35)] rounded-3xl flex flex-col items-center gap-6 my-auto bg-white/95 dark:bg-[#140a2b]/95"
          >
            {/* Header Title Badge */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 shadow-md">
                <span>🏆 Tournament Leaderboard</span>
                {numQuestions > 0 && (
                  <span className="text-purple-800 dark:text-purple-300 font-bold">
                    • Question {index + 1} / {numQuestions}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Current Standings
              </h2>
            </div>

            {/* Live Reordering Animated Leaderboard List */}
            <div className="w-full flex flex-col gap-3 my-2">
              <AnimatePresence>
                {sortedLeaderboard.map((item, rankIdx) => {
                  const rank = rankIdx + 1;
                  const badgeStyle = BADGES[rankIdx] || {
                    rank,
                    icon: `🏅 #${rank}`,
                    bg: "bg-slate-100 dark:bg-purple-950/40 border-slate-300 dark:border-purple-500/30 text-slate-800 dark:text-purple-200",
                    shadow: "shadow-sm",
                  };

                  return (
                    <motion.div
                      key={item.name}
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 25,
                        mass: 0.8,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                        item.isCurrentUpNext
                          ? "bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 dark:from-purple-900/80 dark:via-indigo-900/80 dark:to-purple-900/80 border-purple-400 shadow-[0_4px_25px_rgba(168,85,247,0.25)] dark:shadow-[0_0_30px_rgba(168,85,247,0.4)] ring-2 ring-purple-400/50"
                          : rank <= 3
                          ? `bg-gradient-to-r ${badgeStyle.bg} ${badgeStyle.shadow}`
                          : "bg-slate-50/90 dark:bg-[#140a2b]/90 border-slate-200 dark:border-purple-500/25 hover:border-purple-400/40"
                      }`}
                    >
                      {/* Rank Badge & Team Avatar */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/30 font-black text-base sm:text-lg text-purple-900 dark:text-white shrink-0">
                          {rank <= 3 ? badgeStyle.icon : `#${rank}`}
                        </div>
                        <span className="text-2xl sm:text-3xl shrink-0">
                          {item.avatar}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              dir="auto"
                              className="font-black text-base sm:text-xl text-slate-900 dark:text-white truncate leading-snug"
                            >
                              {item.name}
                            </span>
                            {item.isCurrentUpNext && (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase border border-emerald-300 dark:border-emerald-400/40 shrink-0 animate-pulse">
                                🎯 Up Next
                              </span>
                            )}
                          </div>
                          {/* Animated Progress Bar */}
                          <div className="w-28 sm:w-44 h-2 rounded-full bg-slate-200 dark:bg-purple-950/80 border border-slate-300 dark:border-purple-500/20 overflow-hidden mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  100,
                                  Math.max(8, (item.totalScore / maxScore) * 100)
                                )}%`,
                              }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                rank === 1
                                  ? "bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                                  : rank === 2
                                  ? "bg-gradient-to-r from-slate-300 to-cyan-300"
                                  : "bg-gradient-to-r from-purple-500 to-indigo-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Score Pill */}
                      <div className="flex items-center gap-2 shrink-0">
                        <motion.div
                          key={`score-${item.name}-${item.totalScore}`}
                          initial={{ scale: 1.3, color: "#f59e0b" }}
                          animate={{ scale: 1, color: "#ffffff" }}
                          transition={{ duration: 0.4 }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-purple-500/20 border border-amber-300 dark:border-purple-400/35 font-black text-sm sm:text-lg text-amber-950 dark:text-amber-300 shadow-sm flex items-center gap-1.5"
                        >
                          <span>⭐</span>
                          <span>{item.totalScore}</span>
                          <span className="text-[10px] text-amber-800 dark:text-purple-300 font-extrabold uppercase">
                            pts
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Action Button: Go to Next Team Turn Screen */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 35px rgba(168, 85, 247, 0.5)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setStage("turnAnnouncement")}
              className="btn-primary text-lg sm:text-xl font-black px-8 py-4 rounded-2xl shadow-2xl w-full flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Next Team Turn</span>
              <span className="text-xl">➔</span>
            </motion.button>
          </motion.div>
        ) : (
          /* ============= STAGE 2: NEXT TEAM TURN SCREEN ============= */
          <motion.div
            key="stage-team-turn"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-xl glass-card p-8 sm:p-10 border-2 border-purple-300/90 dark:border-purple-400/50 shadow-[0_20px_70px_rgba(168,85,247,0.3)] dark:shadow-[0_0_80px_rgba(168,85,247,0.45)] rounded-3xl flex flex-col items-center gap-6 text-center my-auto relative overflow-hidden bg-white/95 dark:bg-[#120826]/95"
          >
            {/* Ambient Background Aura */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-purple-600/10 dark:from-purple-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 pointer-events-none rounded-3xl"
            />

            {/* Stage Badge */}
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-400/40 shadow-lg animate-pulse">
              <span>🎯 Turn Announcement</span>
            </span>

            {/* Giant Pulsing Avatar Icon */}
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.6)] text-5xl sm:text-6xl text-white"
            >
              {nextTeamData.avatar}
            </motion.div>

            {/* Next Team Banner */}
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-purple-200">
                It&apos;s Your Turn to Answer!
              </h2>
              <div
                dir="auto"
                className="text-4xl sm:text-6xl font-black text-gradient-purple tracking-tight break-words px-2"
              >
                {nextTeamData.name}
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-extrabold text-sm border border-amber-300 dark:border-amber-400/35 mt-2 shadow-sm">
                ⭐ {nextTeamData.totalScore} Total Points
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-sm">
              Pass the screen or microphone to <strong className="text-slate-900 dark:text-white">{nextTeamData.name}</strong>.
              When ready, press start to begin the question timer!
            </p>

            {/* Buttons Row: Back & Start Ready */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStage("leaderboard")}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-500/30 text-slate-800 dark:text-purple-300 font-extrabold text-sm hover:bg-slate-200 dark:hover:bg-purple-900/60 hover:text-slate-900 dark:hover:text-white transition-all shadow-md w-full sm:w-auto shrink-0 cursor-pointer"
              >
                ⬅ View Leaderboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="btn-primary text-xl font-black px-8 py-4 rounded-2xl shadow-2xl w-full flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>🎮</span>
                <span>Ready to Play!</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeamTransition;
