import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_TEAMS = [
  "الأبطال (Champions)",
  "الفرسان (Knights)",
  "النسور (Eagles)",
  "النجوم (Stars)",
  "الملوك (Kings)",
  "الفراعنة (Pharaohs)",
  "الصقور (Falcons)",
  "الذئاب (Wolves)",
];

const AVAILABLE_AVATARS = [
  "⚡", "🚀", "🔥", "👑", "💎", "🎯", "🌟", "🛡️",
  "🦁", "🦅", "🐺", "🐉", "⚔️", "🏆", "🦄", "☄️"
];

const TEAM_BADGE_STYLES = [
  { bg: "bg-violet-600 text-white border-violet-500" },
  { bg: "bg-emerald-600 text-white border-emerald-500" },
  { bg: "bg-cyan-600 text-white border-cyan-500" },
  { bg: "bg-amber-500 text-slate-950 border-amber-400" },
  { bg: "bg-pink-600 text-white border-pink-500" },
  { bg: "bg-indigo-600 text-white border-indigo-500" },
  { bg: "bg-teal-600 text-white border-teal-500" },
  { bg: "bg-rose-600 text-white border-rose-500" },
];

function TeamSetup({
  onConfirm,
  onBack,
  examMode = "trial",
  secsPerQuestion = 20,
  onSetSecsPerQuestion,
}) {
  const [teamInput, setTeamInput] = useState("");
  // Start with an empty list (no default team names)
  const [teams, setTeams] = useState([]);

  function handleAddTeam(e) {
    if (e) e.preventDefault();
    const name = teamInput.trim();
    if (!name) return;
    if (teams.some((t) => (typeof t === "string" ? t : t.name) === name)) return;

    // Automatically assign avatar based on team count
    const autoAvatar = AVAILABLE_AVATARS[teams.length % AVAILABLE_AVATARS.length];
    setTeams((prev) => [...prev, { name, avatar: autoAvatar }]);
    setTeamInput("");
  }

  function handleAddPreset(count = 1) {
    const existingNames = teams.map((t) => (typeof t === "string" ? t : t.name));
    const available = PRESET_TEAMS.filter((p) => !existingNames.includes(p));
    if (available.length === 0) return;

    const toAdd = available.slice(0, count).map((name, i) => ({
      name,
      avatar: AVAILABLE_AVATARS[(teams.length + i) % AVAILABLE_AVATARS.length],
    }));

    setTeams((prev) => [...prev, ...toAdd]);
  }

  function handleQuickTwoTeams() {
    setTeams([
      { name: "الأبطال (Champions)", avatar: AVAILABLE_AVATARS[0] },
      { name: "الفرسان (Knights)", avatar: AVAILABLE_AVATARS[1] },
    ]);
  }

  function handleQuickFourTeams() {
    setTeams([
      { name: "الأبطال (Champions)", avatar: AVAILABLE_AVATARS[0] },
      { name: "الفرسان (Knights)", avatar: AVAILABLE_AVATARS[1] },
      { name: "النسور (Eagles)", avatar: AVAILABLE_AVATARS[2] },
      { name: "النجوم (Stars)", avatar: AVAILABLE_AVATARS[3] },
    ]);
  }

  function removeTeam(index) {
    setTeams((prev) => {
      const remaining = prev.filter((_, idx) => idx !== index);
      // Re-assign avatars automatically to maintain order
      return remaining.map((t, idx) => ({
        name: typeof t === "string" ? t : t.name,
        avatar: AVAILABLE_AVATARS[idx % AVAILABLE_AVATARS.length],
      }));
    });
  }

  function handleSubmit() {
    if (teams.length >= 2) {
      const teamNames = teams.map((t) => (typeof t === "string" ? t : t.name));
      onConfirm(teamNames);
    }
  }

  const modeLabel =
    examMode === "real"
      ? "🏆 Official Exam"
      : examMode === "shootout"
        ? "🔥 Penalty Shootout"
        : "⚡ Trial Exam";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center"
    >
      {/* Top Navigation Row */}
      {onBack && (
        <div className="w-full max-w-5xl flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-500/30 text-slate-800 dark:text-purple-200 font-black text-sm hover:bg-slate-200 dark:hover:bg-purple-900/60 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>⬅</span>
            <span className="text-white">Back to Mode Selection</span>
          </motion.button>

          {/* Active Mode Summary Tag */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-500/30 text-purple-950 dark:text-purple-200 text-xs font-black">
            <span>{modeLabel}</span>
            <span>•</span>
            <span>⏱️ {secsPerQuestion}s Timer</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-cyan-600 border border-cyan-500 mb-4 shadow-md">
          Stage 2 • Tournament Rosters
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-3">
          Team <span className="text-gradient-purple">Setup</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-2xl max-w-2xl mx-auto font-medium">
          Register at least 2 competing teams. Icon badges are automatically assigned!
        </p>
      </div>

      {/* Quick Match 1-Click Buttons */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-center gap-2.5 mb-6">
        <span className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-300">
          Quick Match Presets:
        </span>
        <button
          type="button"
          onClick={handleQuickTwoTeams}
          className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 text-purple-950 dark:text-purple-200 text-xs font-extrabold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚡</span>
          <span>2 Teams Quick Match</span>
        </button>
        <button
          type="button"
          onClick={handleQuickFourTeams}
          className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 text-purple-950 dark:text-purple-200 text-xs font-extrabold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚔️</span>
          <span>4 Teams Battle Royale</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddPreset(1)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-slate-200 text-xs font-extrabold hover:bg-slate-200 dark:hover:bg-white/20 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>+</span>
          <span>Add Preset Name</span>
        </button>
      </div>

      {/* Clean Full-Width Team Input Form */}
      <div className="w-full max-w-4xl mb-8">
        <form onSubmit={handleAddTeam} className="w-full">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Input Field */}
            <input
              type="text"
              dir="auto"
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              placeholder="Type team name (e.g. Thunderbolts)..."
              className="flex-1 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0f131d]/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-6 py-4 text-xl sm:text-2xl font-extrabold focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all shadow-sm"
              aria-label="Team name"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary text-xl px-8 py-4 shrink-0 rounded-2xl shadow-xl cursor-pointer"
            >
              + Add Team
            </motion.button>
          </div>
        </form>
      </div>

      {/* Registered Teams Grid */}
      <div className="w-full max-w-5xl mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-base font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-300">
            Registered Teams ({teams.length})
          </span>
          {teams.length < 2 && (
            <span className="text-sm text-rose-700 dark:text-rose-400 font-extrabold">
              Need {2 - teams.length} more to play
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[100px]">
          <AnimatePresence>
            {teams.map((item, index) => {
              const name = typeof item === "string" ? item : item.name;
              const avatar = AVAILABLE_AVATARS[index % AVAILABLE_AVATARS.length];
              const badgeStyle = TEAM_BADGE_STYLES[index % TEAM_BADGE_STYLES.length];

              return (
                <motion.div
                  key={`${name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                  className="glass-card p-4 sm:p-5 flex items-center justify-between border-2 border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f131d]/90 shadow-md rounded-2xl group hover:border-purple-400 dark:hover:border-purple-400/40 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Auto-Assigned Badge Icon */}
                    <div
                      className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center border-2 shrink-0 shadow-sm ${badgeStyle.bg}`}
                    >
                      {avatar}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 dark:text-purple-300">
                        Team #{index + 1}
                      </span>
                      <span
                        dir="auto"
                        className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl truncate"
                      >
                        {name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeTeam(index)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:text-rose-400 dark:hover:bg-rose-500/15 flex items-center justify-center transition-colors text-sm font-black shrink-0 cursor-pointer"
                    aria-label={`Remove ${name}`}
                    type="button"
                  >
                    ✕
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {teams.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl p-8 text-center text-slate-600 dark:text-slate-400 text-base font-semibold bg-white/50 dark:bg-transparent">
              No teams added yet. Type a team name above or choose a Quick Match preset!
            </div>
          )}
        </div>
      </div>

      {/* Pre-Game Timer Quick-Adjust Pill */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-3.5 sm:p-4 rounded-2xl glass-card border border-purple-200 dark:border-purple-500/30 bg-white/90 dark:bg-[#120826]/90 shadow-md mb-8">
        <span className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span>⏱️</span>
          <span>Question Timer:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[10, 15, 20, 30, 45, 60].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetSecsPerQuestion && onSetSecsPerQuestion(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                secsPerQuestion === s
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md scale-105 border-2 border-violet-500"
                  : "bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border-2 border-purple-200 hover:border-purple-400 dark:border-white/15 hover:bg-purple-50 dark:hover:bg-white/20 shadow-sm"
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      {teams.length >= 2 ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(16, 185, 129, 0.5)" }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          className="btn-primary btn-emerald text-xl sm:text-2xl px-12 py-5 rounded-2xl w-full sm:w-auto shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>🎯</span>
          <span>Choose Topic Level ({teams.length} Teams Ready)</span>
          <span className="text-2xl">➔</span>
        </motion.button>
      ) : (
        <p className="text-center text-slate-700 dark:text-slate-400 text-base font-semibold">
          Add at least 2 teams to unlock the tournament round
        </p>
      )}
    </motion.div>
  );
}

export default TeamSetup;
