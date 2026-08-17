import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BADGES = [
  {
    rank: 1,
    icon: "🥇",
    label: "1st Place",
    bg: "from-amber-200/90 via-yellow-100/90 to-amber-200/90 dark:from-amber-500/30 dark:to-yellow-500/10 border-amber-400 text-amber-950 dark:text-amber-600",
    shadow: "shadow-[0_4px_20px_rgba(245,158,11,0.25)] dark:shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/60",
    badgeBg: "bg-amber-400 text-amber-950 border-amber-500",
  },
  {
    rank: 2,
    icon: "🥈",
    label: "2nd Place",
    bg: "from-slate-100 to-slate-200/70 dark:from-slate-400/30 dark:to-slate-500/10 border-slate-300 text-slate-900 dark:text-slate-200",
    shadow: "shadow-[0_4px_15px_rgba(203,213,225,0.25)] dark:shadow-[0_0_20px_rgba(203,213,225,0.25)]",
    badgeBg: "bg-slate-300 text-slate-900 border-slate-400",
  },
  {
    rank: 3,
    icon: "🥉",
    label: "3rd Place",
    bg: "from-amber-100/70 to-orange-100/60 dark:from-amber-700/30 dark:to-amber-800/10 border-amber-300 text-amber-950 dark:text-amber-600",
    shadow: "shadow-[0_4px_15px_rgba(217,119,6,0.2)] dark:shadow-[0_0_15px_rgba(217,119,6,0.25)]",
    badgeBg: "bg-amber-600 text-white border-amber-500",
  },
];

const DEFAULT_AVATARS = ["⚡", "🚀", "🔥", "👑", "💎", "🎯", "🌟", "🛡️"];

function TeamTransition({
  team,
  teams = [],
  points = {},
  totalPoints = {},
  prevPoints = {},
  lastScoredTeam = null,
  lastPointsEarned = 0,
  index = 0,
  numQuestions = 0,
  onContinue,
}) {
  const isFirstQuestionOfRound = index === 0 && (!lastScoredTeam || lastPointsEarned === 0);
  const [stage, setStage] = useState(() =>
    isFirstQuestionOfRound ? "turnAnnouncement" : "leaderboard"
  );
  const hasAnimatedScoreRef = useRef(false);

  // Compute pre-score and target-score maps
  const { initialScores, targetScores, hasScoreChange } = useMemo(() => {
    const init = {};
    const targ = {};
    let change = false;

    (teams || []).forEach((t) => {
      const curScore = Number(points?.[t]) || 0;
      const totScore = Number(totalPoints?.[t]) || 0;
      targ[t] = curScore + totScore;

      if (t === lastScoredTeam && lastPointsEarned > 0) {
        const prev = prevPoints?.[t];
        const base = prev !== undefined && prev !== null
          ? Number(prev)
          : Math.max(0, curScore - lastPointsEarned);
        init[t] = base + totScore;
        if (init[t] !== targ[t]) {
          change = true;
        }
      } else {
        init[t] = curScore + totScore;
      }
    });

    return { initialScores: init, targetScores: targ, hasScoreChange: change };
  }, [teams, points, totalPoints, prevPoints, lastScoredTeam, lastPointsEarned]);

  // Track animation phase: "initial" -> "scoring" -> "reordered"
  const [animationPhase, setAnimationPhase] = useState(() =>
    hasScoreChange ? "initial" : "reordered"
  );
  const [displayedScores, setDisplayedScores] = useState(() =>
    hasScoreChange ? initialScores : targetScores
  );
  const [showFloatingPoints, setShowFloatingPoints] = useState(false);

  // Animated slow motion score counting and slow reordering transition
  useEffect(() => {
    if (!hasScoreChange || hasAnimatedScoreRef.current) {
      setAnimationPhase("reordered");
      setDisplayedScores(targetScores);
      return;
    }

    hasAnimatedScoreRef.current = true;
    setDisplayedScores(initialScores);
    setAnimationPhase("initial");

    // Phase 2: Start score addition at 600ms
    const timer1 = setTimeout(() => {
      setAnimationPhase("scoring");
      setShowFloatingPoints(true);

      const startScore = initialScores[lastScoredTeam] || 0;
      const endScore = targetScores[lastScoredTeam] || 0;
      const duration = 2000; // 2.0 seconds cinematic count-up
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Smooth ease-out deceleration
        const eased = 1 - Math.pow(1 - progress, 2.5);
        const currentVal = Math.round(startScore + (endScore - startScore) * eased);

        setDisplayedScores((prev) => ({
          ...prev,
          [lastScoredTeam]: currentVal,
        }));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayedScores((prev) => ({
            ...prev,
            [lastScoredTeam]: endScore,
          }));
        }
      }

      requestAnimationFrame(step);
    }, 600);

    // Auto-hide floating points after 2.6s so it animates then disappears
    const timerFloat = setTimeout(() => {
      setShowFloatingPoints(false);
    }, 2800);

    // Phase 3: Trigger smooth reordering at 3200ms
    const timer2 = setTimeout(() => {
      setAnimationPhase("reordered");
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timerFloat);
      clearTimeout(timer2);
    };
  }, [hasScoreChange, initialScores, targetScores, lastScoredTeam]);

  // Initial and final rank maps to detect position climb/fall
  const initialRankMap = useMemo(() => {
    const list = (teams || []).map((t) => ({ name: t, score: initialScores[t] || 0 }));
    list.sort((a, b) => b.score - a.score);
    const map = {};
    list.forEach((item, idx) => {
      map[item.name] = idx + 1;
    });
    return map;
  }, [teams, initialScores]);

  const targetRankMap = useMemo(() => {
    const list = (teams || []).map((t) => ({ name: t, score: targetScores[t] || 0 }));
    list.sort((a, b) => b.score - a.score);
    const map = {};
    list.forEach((item, idx) => {
      map[item.name] = idx + 1;
    });
    return map;
  }, [teams, targetScores]);

  // Active sorted leaderboard list based on current animation phase
  const activeLeaderboard = useMemo(() => {
    const isReordered = animationPhase === "reordered";
    const scoreMap = isReordered ? targetScores : initialScores;

    return (teams || [])
      .map((teamName, idx) => {
        const totalScore = scoreMap[teamName] || 0;
        const liveScore = displayedScores[teamName] ?? totalScore;
        const avatar = DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
        const oldRank = initialRankMap[teamName] || idx + 1;
        const newRank = targetRankMap[teamName] || idx + 1;
        const rankClimb = oldRank - newRank;

        return {
          name: teamName,
          totalScore,
          liveScore,
          avatar,
          oldRank,
          newRank,
          rankClimb,
          isCurrentUpNext: teamName === team,
          isScoringTeam: teamName === lastScoredTeam && hasScoreChange,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [
    teams,
    animationPhase,
    initialScores,
    targetScores,
    displayedScores,
    team,
    lastScoredTeam,
    hasScoreChange,
    initialRankMap,
    targetRankMap,
  ]);

  const maxScore = Math.max(
    ...activeLeaderboard.map((t) => displayedScores[t.name] ?? t.totalScore),
    1
  );

  const nextTeamData = activeLeaderboard.find((t) => t.name === team) || {
    name: team,
    avatar: "🎯",
    liveScore: displayedScores[team] ?? targetScores[team] ?? 0,
    totalScore: targetScores[team] ?? 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 dark:bg-black/85 backdrop-blur-xl overflow-y-auto">
      <AnimatePresence mode="wait">
        {stage === "leaderboard" ? (
          /* ============= STAGE 1: LEADERBOARD STANDINGS ============= */
          <motion.div
            key="stage-leaderboard"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl glass-card p-6 sm:p-8 border-2 border-purple-300/80 dark:border-purple-500/40 shadow-[0_20px_60px_rgba(124,58,237,0.25)] dark:shadow-[0_0_60px_rgba(139,92,246,0.35)] rounded-3xl flex flex-col items-center gap-6 my-auto bg-white/95 dark:bg-[#140a2b]/95 overflow-visible relative"
          >
            {/* Header Title Badge */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white bg-cyan-600 dark:bg-cyan-600 border border-cyan-400 shadow-md">
                <span>🏆 Tournament Leaderboard</span>
                {numQuestions > 0 && (
                  <span className="text-cyan-100 font-bold">
                    • Question {index + 1} / {numQuestions}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Current Standings
              </h2>
            </div>

            {/* Live Reordering Animated Leaderboard List */}
            <div className="w-full flex flex-col gap-3 my-2 overflow-visible">
              <AnimatePresence>
                {activeLeaderboard.map((item, rankIdx) => {
                  const rank = rankIdx + 1;
                  const badgeStyle = BADGES[rankIdx] || {
                    rank,
                    icon: `🏅 #${rank}`,
                    bg: "bg-slate-50/95 dark:bg-[#140a2b]/95 border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-purple-200",
                    shadow: "shadow-sm",
                    badgeBg: "bg-purple-100 dark:bg-purple-900/60 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-500/40",
                  };

                  const isScoreJustAdded =
                    item.isScoringTeam &&
                    (animationPhase === "scoring" || animationPhase === "reordered");
                  const hasClimbed =
                    item.isScoringTeam &&
                    animationPhase === "reordered" &&
                    item.rankClimb > 0;

                  return (
                    <motion.div
                      key={item.name}
                      layout
                      transition={{
                        layout: {
                          type: "spring",
                          stiffness: 45, // slow, majestic, broadcast-style glide
                          damping: 15,
                          mass: 1.8,
                        },
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all duration-500 overflow-visible ${isScoreJustAdded
                        ? "ring-2 ring-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.35)] dark:shadow-[0_0_35px_rgba(16,185,129,0.45)]"
                        : ""
                        } ${item.isCurrentUpNext
                          ? "bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 dark:from-purple-900/80 dark:via-indigo-900/80 dark:to-purple-900/80 border-purple-400 shadow-[0_4px_25px_rgba(168,85,247,0.25)] dark:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                          : rank <= 3
                            ? `bg-gradient-to-r ${badgeStyle.bg} ${badgeStyle.shadow}`
                            : "bg-slate-50/95 dark:bg-[#140a2b]/95 border-slate-200 dark:border-purple-500/25 hover:border-purple-400/40"
                        }`}
                    >
                      {/* Rank Badge & Team Avatar */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Position Icon / Number */}
                        <div
                          className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-base sm:text-lg shrink-0 border transition-all duration-700 ${badgeStyle.badgeBg}`}
                        >
                          {rank <= 3 ? (
                            <span>{badgeStyle.icon}</span>
                          ) : (
                            <span className="text-slate-900 dark:text-purple-200">
                              #{rank}
                            </span>
                          )}
                        </div>

                        <span className="text-2xl sm:text-3xl shrink-0 filter drop-shadow-sm">
                          {item.avatar}
                        </span>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              dir="auto"
                              className="font-black text-base sm:text-xl text-slate-950 dark:text-white truncate leading-snug"
                            >
                              {item.name}
                            </span>

                            {/* Up Next Badge */}
                            {item.isCurrentUpNext && (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-[10px] font-black uppercase border border-emerald-400/60 shrink-0 animate-pulse">
                                🎯 Up Next
                              </span>
                            )}

                            {/* Position Climb Badge (Moving Up) */}
                            <AnimatePresence>
                              {hasClimbed && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.5, x: -15 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase border border-amber-500 shrink-0 shadow-md flex items-center gap-1"
                                >
                                  <span>▲</span>
                                  <span>Rank {rank}!</span>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Animated Progress Bar */}
                          <div className="w-28 sm:w-44 h-2 rounded-full bg-slate-200 dark:bg-purple-950/80 border border-slate-300 dark:border-purple-500/20 overflow-hidden mt-1 shadow-inner">
                            <motion.div
                              animate={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    8,
                                    ((displayedScores[item.name] ?? item.totalScore) /
                                      maxScore) *
                                    100
                                  )
                                )}%`,
                              }}
                              transition={{ duration: 1.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${rank === 1
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                                : rank === 2
                                  ? "bg-gradient-to-r from-slate-400 to-cyan-400"
                                  : "bg-gradient-to-r from-purple-500 to-indigo-400"
                                }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Score Pill with High-Contrast Text & Floating Points Pop */}
                      <div className="flex items-center gap-2 shrink-0 relative overflow-visible">
                        {/* Floating Animated Score Badge When Team Answers Right */}
                        <AnimatePresence>
                          {item.isScoringTeam && showFloatingPoints && lastPointsEarned > 0 && (
                            <motion.div
                              key="floating-pts"
                              initial={{ opacity: 0, scale: 0.3, y: 0 }}
                              animate={{
                                opacity: [0, 1, 1, 0.95],
                                scale: [0.3, 1.25, 1.1],
                                y: [0, -38, -46],
                              }}
                              exit={{ opacity: 0, y: -65, scale: 0.8, filter: "blur(4px)" }}
                              transition={{
                                duration: 1.8,
                                times: [0, 0.25, 1],
                                ease: "easeOut",
                              }}
                              className="absolute -top-3 right-0 sm:right-1 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-white font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(16,185,129,0.95)] border-2 border-white flex items-center gap-1.5 z-50 pointer-events-none drop-shadow-2xl whitespace-nowrap"
                            >
                              <span className="animate-bounce">✨</span>
                              <span className="tracking-wide">+{lastPointsEarned} PTS!</span>
                              <span>🎉</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div
                          animate={
                            item.isScoringTeam && animationPhase === "scoring"
                              ? {
                                scale: [1, 1.2, 1.05],
                                boxShadow: [
                                  "0 0 0px rgba(245,158,11,0)",
                                  "0 0 25px rgba(245,158,11,0.8)",
                                  "0 0 15px rgba(245,158,11,0.4)",
                                ],
                              }
                              : { scale: 1 }
                          }
                          transition={{ duration: 1.0, ease: "easeInOut" }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/20 border-2 border-amber-300 dark:border-amber-400/40 shadow-sm flex items-center gap-1.5 shrink-0"
                        >
                          <span className="text-base sm:text-lg">⭐</span>
                          <span className="text-base sm:text-xl font-black text-black dark:text-amber-600">
                            {displayedScores[item.name] ?? item.totalScore}
                          </span>
                          <span className="text-[11px] text-amber-900 dark:text-amber-600 font-extrabold uppercase">
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-xl glass-card p-8 sm:p-10 border-2 border-purple-300/90 dark:border-purple-400/50 shadow-[0_20px_70px_rgba(168,85,247,0.3)] dark:shadow-[0_0_80px_rgba(168,85,247,0.45)] rounded-3xl flex flex-col items-center gap-6 text-center my-auto relative overflow-hidden bg-white/95 dark:bg-[#120826]/95"
          >
            {/* Ambient Background Aura */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 3.0 }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-purple-600/10 dark:from-purple-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 pointer-events-none rounded-3xl"
            />

            {/* Stage Badge */}
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white bg-emerald-600 border border-emerald-500 shadow-lg animate-pulse">
              <span>🎯 Turn Announcement</span>
            </span>

            {/* Giant Pulsing Avatar Icon */}
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
              className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.6)] text-5xl sm:text-6xl text-white"
            >
              {nextTeamData.avatar}
            </motion.div>

            {/* Next Team Banner */}
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-purple-200">
                It&apos;s Your Turn to Answer!
              </h2>
              <div
                dir="auto"
                className="text-4xl sm:text-6xl font-black text-gradient-purple tracking-tight break-words px-2"
              >
                {nextTeamData.name}
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/20 text-black dark:text-amber-600 font-extrabold text-sm border border-amber-300 dark:border-amber-400/35 mt-2 shadow-sm">
                ⭐ {displayedScores[nextTeamData.name] ?? nextTeamData.totalScore} Total Points
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-sm">
              Pass the screen or microphone to <strong className="text-slate-950 dark:text-white">{nextTeamData.name}</strong>.
              When ready, press start to begin the question timer!
            </p>

            {/* Buttons Row: Back & Start Ready */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStage("leaderboard")}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-500/30 text-white dark:text-purple-300 font-extrabold text-sm hover:bg-slate-200 dark:hover:bg-purple-900/60 hover:text-slate-950 dark:hover:text-white transition-all shadow-md w-full sm:w-auto shrink-0 cursor-pointer"
              >
                ⬅ View Leaderboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="btn-primary px-8 py-4 rounded-2xl shadow-2xl w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🎮</span>
                <span className="text-2xl font-extrabold">Ready to Play!</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeamTransition;
