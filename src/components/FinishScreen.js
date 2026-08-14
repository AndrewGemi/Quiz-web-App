import React from "react";
import { motion } from "framer-motion";

const DEFAULT_AVATARS = ["⚡", "🚀", "🔥", "👑", "💎", "🎯", "🌟", "🛡️"];

// 30 Confetti particles for 1st place celebration
const CONFETTI_PIECES = Array.from({ length: 32 }).map((_, i) => ({
  id: i,
  x: (i % 2 === 0 ? 1 : -1) * (15 + (i * 12) % 120),
  y: -(60 + (i * 15) % 180),
  rotate: i * 45,
  scale: 0.7 + (i % 5) * 0.15,
  color: ["#fbbf24", "#f59e0b", "#a855f7", "#ec4899", "#38bdf8", "#10b981", "#f43f5e"][
    i % 7
  ],
  delay: 4.2 + (i % 8) * 0.1,
}));

function FinishScreen({
  points,
  totalPoints,
  dispatch,
}) {
  const safePoints = points || {};
  const safeTotalPoints = totalPoints || {};

  const allTeams = Array.from(
    new Set([...Object.keys(safeTotalPoints), ...Object.keys(safePoints)])
  );

  const mergedTotals = allTeams
    .map((team, idx) => ({
      team,
      total:
        (Number(safeTotalPoints[team]) || 0) +
        (Number(safePoints[team]) || 0),
      avatar: DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length],
    }))
    .sort((a, b) => b.total - a.total);

  let lastScore = null;
  let lastRank = 0;
  const rankedTotals = mergedTotals.map((t, idx) => {
    const rank = t.total === lastScore ? lastRank : idx + 1;
    lastScore = t.total;
    lastRank = rank;
    return { ...t, rank, isWinner: rank === 1 };
  });

  const maxTotalScore = Math.max(...rankedTotals.map((t) => t.total), 1);
  const uniqueScores = Array.from(new Set(mergedTotals.map(t => t.total))).sort((a, b) => b - a);
  const placeGroups = uniqueScores.map((score, index) => ({
    place: index + 1,
    score,
    teams: mergedTotals.filter(t => t.total === score)
  }));

  const winnerGroup = placeGroups.find(g => g.place === 1);
  const runnerUpGroup = placeGroups.find(g => g.place === 2);
  const thirdPlaceGroup = placeGroups.find(g => g.place === 3);

  const tiedGroupInTop3 = placeGroups.slice(0, 3).find(g => g.teams.length > 1);
  const isFirstPlaceTie = winnerGroup && winnerGroup.teams.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center gap-10"
    >
      {/* ================= GRAND TOURNAMENT PODIUM CEREMONY ================= */}
      <div className="w-full text-center flex flex-col items-center">
        {/* Championship Header */}
        <div className="mb-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950 dark:text-amber-300 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 mb-3 shadow-lg animate-pulse"
          >
            🏆 Grand Championship Ceremony
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-2"
          >
            Tournament <span className="text-gradient-gold">Champions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-900 dark:text-slate-300 text-base sm:text-xl font-bold"
          >
            Honoring top 3 positions from lowest to highest:
          </motion.p>
        </div>

        {/* 3D Victory Podium Grid (Revealing 3rd -> 2nd -> 1st) */}
        <div className="w-full max-w-4xl grid grid-cols-3 gap-3 sm:gap-6 items-end mb-16 min-h-[340px] px-2 relative">
          
          {/* ================= POSITION 2: 2nd Place (Silver) - Reveals at 2.4s ================= */}
          <div className="flex flex-col items-center">
            {runnerUpGroup ? (
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 2.4,
                  duration: 1.2,
                  type: "spring",
                  stiffness: 90,
                  damping: 14,
                }}
                className="w-full flex flex-col items-center"
              >
                <div className="flex flex-wrap justify-center gap-2 mb-2 w-full">
                  {runnerUpGroup.teams.map(t => (
                    <div key={t.team} className="flex flex-col items-center w-1/3 min-w-[60px]">
                      <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow-md">
                        {t.avatar || "🥈"}
                      </span>
                      <div
                        dir="auto"
                        className="font-black text-slate-900 dark:text-slate-100 text-xs sm:text-sm text-center truncate w-full"
                      >
                        {t.team}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full rounded-t-3xl bg-gradient-to-t from-slate-200 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700/90 border-2 border-slate-300 dark:border-slate-400/60 p-4 sm:p-6 text-center shadow-[0_10px_30px_rgba(203,213,225,0.4)] dark:shadow-[0_0_35px_rgba(203,213,225,0.35)] h-44 sm:h-52 flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-4xl sm:text-5xl mb-1">🥈</span>
                  <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                    {runnerUpGroup.score}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-black uppercase tracking-wider mt-1">
                    2nd Place
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-44" />
            )}
          </div>

          {/* ================= POSITION 1: 1st Place (Gold Champion) - Reveals at 4.0s ================= */}
          <div className="flex flex-col items-center z-20 relative">
            {winnerGroup && (
              <motion.div
                initial={{ opacity: 0, y: 140, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1.08 }}
                transition={{
                  delay: 4.0,
                  duration: 1.4,
                  type: "spring",
                  stiffness: 80,
                  damping: 12,
                }}
                className="w-full flex flex-col items-center relative"
              >
                {/* Celebratory Floating Confetti Particles around 1st Place */}
                {CONFETTI_PIECES.map((piece) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: piece.x,
                      y: piece.y,
                      rotate: piece.rotate,
                      scale: piece.scale,
                    }}
                    transition={{
                      delay: piece.delay,
                      duration: 2.5,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    style={{ backgroundColor: piece.color }}
                    className="absolute top-10 left-1/2 w-3 h-3 rounded-sm pointer-events-none z-30 shadow-md"
                  />
                ))}

                {/* Floating Animated Golden Crown */}
                <motion.div
                  initial={{ opacity: 0, y: -50, rotate: -30, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{
                    delay: 4.8,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 180,
                  }}
                  className="text-5xl sm:text-7xl mb-1 filter drop-shadow-[0_0_20px_rgba(251,191,36,1)] animate-bounce"
                >
                  {isFirstPlaceTie ? "⚔️" : "👑"}
                </motion.div>

                {/* Champion Title Badge */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 5.0, duration: 0.4 }}
                  className={`px-3.5 py-1 rounded-full font-black text-[11px] uppercase tracking-widest mb-1.5 shadow-md border ${isFirstPlaceTie ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 border-rose-600 text-white' : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-amber-500 text-slate-950'}`}
                >
                  {isFirstPlaceTie ? "⚔️ TIED FOR FIRST ⚔️" : "🏆 TOURNAMENT WINNER 🏆"}
                </motion.span>

                <div className="flex flex-wrap justify-center gap-3 mb-2 w-full">
                  {winnerGroup.teams.map(t => (
                    <div key={t.team} className={`flex flex-col items-center w-1/3 min-w-[70px] ${isFirstPlaceTie ? 'animate-pulse' : ''}`}>
                      <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow-md">
                        {t.avatar || "🥇"}
                      </span>
                      <div
                        dir="auto"
                        className="font-black text-slate-950 dark:text-amber-300 text-sm sm:text-lg text-center truncate w-full drop-shadow-sm dark:drop-shadow-md"
                      >
                        {t.team}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`w-full rounded-t-3xl bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-300 dark:from-amber-950 dark:via-amber-600/50 dark:to-yellow-400/60 border-4 border-amber-400 dark:border-amber-400 p-5 sm:p-8 text-center shadow-[0_20px_50px_rgba(217,119,6,0.35)] dark:shadow-[0_0_80px_rgba(251,191,36,0.7)] h-60 sm:h-72 flex flex-col items-center justify-center relative overflow-hidden ring-4 ${isFirstPlaceTie ? 'ring-rose-500/80 animate-pulse' : 'ring-amber-400/50'}`}>
                  {/* Glowing background aura pulse */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute inset-0 bg-yellow-200/30 dark:bg-amber-400/25 pointer-events-none rounded-t-3xl"
                  />

                  <span className="text-5xl sm:text-7xl mb-1 filter drop-shadow-lg">🥇</span>
                  <span className="text-4xl sm:text-6xl font-black text-slate-950 dark:text-amber-200 drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)] dark:drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]">
                    {winnerGroup.score}
                  </span>
                  <span className="text-xs sm:text-base text-amber-950 dark:text-amber-100 font-black uppercase tracking-widest mt-1">
                    {isFirstPlaceTie ? "Shootout Required!" : "1st Place Champion"}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ================= POSITION 3: 3rd Place (Bronze) - Reveals First at 0.8s ================= */}
          <div className="flex flex-col items-center">
            {thirdPlaceGroup ? (
              <motion.div
                initial={{ opacity: 0, y: 90, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 1.2,
                  type: "spring",
                  stiffness: 90,
                  damping: 14,
                }}
                className="w-full flex flex-col items-center"
              >
                <div className="flex flex-wrap justify-center gap-2 mb-2 w-full">
                  {thirdPlaceGroup.teams.map(t => (
                    <div key={t.team} className="flex flex-col items-center w-1/3 min-w-[60px]">
                      <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow-md">
                        {t.avatar || "🥉"}
                      </span>
                      <div
                        dir="auto"
                        className="font-black text-amber-950 dark:text-amber-400 text-xs sm:text-sm text-center truncate w-full"
                      >
                        {t.team}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full rounded-t-3xl bg-gradient-to-t from-orange-400 via-orange-300 to-orange-200/90 dark:from-amber-950/80 dark:via-amber-900/50 dark:to-amber-800/40 border-2 border-orange-500 dark:border-amber-700/60 p-4 sm:p-6 text-center shadow-[0_10px_25px_rgba(234,88,12,0.3)] dark:shadow-[0_0_30px_rgba(217,119,6,0.35)] h-36 sm:h-44 flex flex-col items-center justify-center relative overflow-hidden text-orange-950 dark:text-white">
                  <span className="text-4xl sm:text-5xl mb-1">🥉</span>
                  <span className="text-2xl sm:text-3xl font-black text-orange-950 dark:text-amber-400 drop-shadow-sm">
                    {thirdPlaceGroup.score}
                  </span>
                  <span className="text-xs sm:text-sm text-orange-950 dark:text-amber-500 font-extrabold uppercase tracking-wider mt-1">
                    3rd Place
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-36" />
            )}
          </div>
        </div>

        {/* ================= WHOLE LEADERBOARD TABLE - Reveals at 5.6s ================= */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.6, duration: 0.9, ease: "easeOut" }}
          className="w-full max-w-5xl glass-card p-6 sm:p-8 border-2 border-purple-200/90 dark:border-purple-500/40 bg-white/95 dark:bg-[#140a2b]/95 shadow-[0_20px_60px_rgba(139,92,246,0.15)] dark:shadow-[0_0_60px_rgba(139,92,246,0.3)] rounded-3xl flex flex-col gap-5 mt-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-purple-200 dark:border-purple-500/30 text-center sm:text-left">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-purple-950 dark:text-purple-300">
                Full Tournament Standings
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Official Leaderboard Table
              </h3>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-400/35 text-xs font-extrabold shadow-sm">
              Total Teams: {rankedTotals.length}
            </span>
          </div>

          {/* Individual Ranked Team Rows */}
          <div className="flex flex-col gap-3">
            {rankedTotals.map(({ team, total, rank, isWinner, avatar }, index) => {
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <motion.div
                  key={team}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 5.8 + index * 0.12, duration: 0.4 }}
                  className={[
                    "p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 border-2 transition-all",
                    isWinner
                      ? "bg-gradient-to-r from-amber-200/90 via-yellow-100/90 to-amber-200/90 dark:from-amber-500/25 dark:via-yellow-500/15 dark:to-amber-500/25 border-amber-400 text-amber-950 dark:text-white shadow-[0_6px_25px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/50"
                      : isSecond
                      ? "bg-gradient-to-r from-slate-100 to-slate-200/70 dark:from-slate-500/20 dark:to-slate-600/10 border-slate-300 dark:border-slate-300/60 text-slate-900 dark:text-slate-100"
                      : isThird
                      ? "bg-gradient-to-r from-amber-100/70 to-orange-100/60 dark:from-amber-800/20 dark:to-amber-900/10 border-amber-300 dark:border-amber-600/60 text-amber-950 dark:text-amber-200"
                      : "bg-slate-50/90 dark:bg-[#160c33]/80 border-slate-200 dark:border-purple-500/25 hover:border-purple-400/40 text-slate-800 dark:text-slate-200",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={[
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-black text-base sm:text-xl flex items-center justify-center border-2 shrink-0 shadow-md",
                        isWinner
                          ? "bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-400 text-slate-950 border-amber-500"
                          : isSecond
                          ? "bg-slate-300 text-slate-950 border-slate-200"
                          : isThird
                          ? "bg-amber-600 text-white border-amber-500"
                          : "bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-500/30",
                      ].join(" ")}
                    >
                      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
                    </div>

                    <span className="text-2xl sm:text-3xl shrink-0">{avatar}</span>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span dir="auto" className="font-black text-lg sm:text-2xl text-slate-900 dark:text-white truncate leading-snug">
                          {team}
                        </span>
                        {isWinner && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 text-[10px] font-black uppercase border border-amber-500 shrink-0 shadow-sm">
                            🏆 Champion
                          </span>
                        )}
                      </div>

                      {/* Relative Progress Bar */}
                      <div className="w-32 sm:w-56 h-2 rounded-full bg-slate-200 dark:bg-purple-950/80 border border-slate-300 dark:border-purple-500/20 overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(100, Math.max(10, (total / maxTotalScore) * 100))}%`,
                          }}
                          transition={{ delay: 6.0 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isWinner
                              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                              : isSecond
                              ? "bg-gradient-to-r from-slate-300 to-cyan-300"
                              : isThird
                              ? "bg-gradient-to-r from-amber-600 to-amber-400"
                              : "bg-gradient-to-r from-purple-500 to-indigo-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Score */}
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-purple-500/20 border border-amber-300 dark:border-purple-400/30 shrink-0 shadow-sm">
                    <span className="text-base sm:text-xl">⭐</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-300">
                      {total}
                    </span>
                    <span className="text-xs text-amber-950 dark:text-purple-300 font-extrabold uppercase hidden sm:inline">
                      pts
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full">
          {tiedGroupInTop3 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 6.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 45px rgba(239, 68, 68, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary bg-gradient-to-r from-red-600 to-rose-500 border-none text-xl sm:text-2xl font-black px-8 py-5 sm:py-6 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer"
              onClick={() => dispatch({ type: "startPenaltyShootout", payload: tiedGroupInTop3.teams.map(t => t.team) })}
            >
              <span>⚔️</span>
              <span>Resolve Tie: Penalty Shootout!</span>
            </motion.button>
          )}

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6.4, duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 45px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-emerald text-xl sm:text-2xl font-black px-12 py-5 sm:py-6 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer"
            onClick={() => dispatch({ type: "restart" })}
          >
            <span>🔄</span>
            <span>Start New Tournament</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default FinishScreen;
