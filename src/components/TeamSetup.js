import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_TEAMS = [
  "الأبطال (Champions)",
  "الفرسان (Knights)",
  "النسور (Eagles)",
  "النجوم (Stars)",
  "الملوك (Kings)",
  "الفراعنة (Pharaohs)",
];

const TEAM_BADGE_STYLES = [
  { bg: "bg-violet-100 dark:bg-violet-500/20 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-500/40", icon: "🟣" },
  { bg: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40", icon: "🟢" },
  { bg: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40", icon: "🔵" },
  { bg: "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40", icon: "🟡" },
  { bg: "bg-pink-100 dark:bg-pink-500/20 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-500/40", icon: "🔴" },
];

function TeamSetup({ onConfirm }) {
  const [teamInput, setTeamInput] = useState("");
  const [teams, setTeams] = useState([]);

  function handleAddTeam(e) {
    if (e) e.preventDefault();
    const name = teamInput.trim();
    if (!name) return;
    if (teams.includes(name)) return;
    setTeams((t) => [...t, name]);
    setTeamInput("");
  }

  function handleAddPreset() {
    const available = PRESET_TEAMS.filter((p) => !teams.includes(p));
    if (available.length === 0) return;
    const nextPreset = available[0];
    setTeams((t) => [...t, nextPreset]);
  }

  function handleSubmit() {
    if (teams.length >= 2) onConfirm(teams);
  }

  function removeTeam(name) {
    setTeams((prev) => prev.filter((t) => t !== name));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center"
    >
      <div className="text-center mb-10">
        <span className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 mb-4 shadow-md">
          Stage 2 • Tournament Rosters
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4">
          Team <span className="text-gradient-purple">Setup</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-2xl max-w-2xl mx-auto font-medium">
          Register at least 2 teams to compete for cumulative round points.
        </p>
      </div>

      {/* Input Form & Preset Action */}
      <div className="w-full max-w-4xl mb-10">
        <form onSubmit={handleAddTeam} className="w-full mb-4">
          <div className="relative flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              dir="auto"
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              placeholder="Enter team name..."
              className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0f131d]/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-7 py-6 text-2xl sm:text-3xl font-extrabold focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all shadow-sm dark:shadow-inner text-start"
              aria-label="Team name"
            />
            <button
              type="submit"
              className="btn-primary text-2xl px-10 py-6 shrink-0"
            >
              + Add Team
            </button>
          </div>
        </form>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddPreset}
            className="btn-secondary text-sm px-5 py-2.5 rounded-xl border border-violet-300 dark:border-violet-500/30 text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-transparent hover:bg-violet-200 dark:hover:bg-violet-500/10 flex items-center gap-2 font-bold"
          >
            ⚡ Quick Preset Team Name
          </button>
        </div>
      </div>

      {/* Registered Teams Widescreen Grid */}
      <div className="w-full max-w-5xl mb-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-base font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-300">
            Registered Teams ({teams.length})
          </span>
          {teams.length < 2 && (
            <span className="text-sm text-rose-700 dark:text-rose-400 font-extrabold">
              Need {2 - teams.length} more
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
          <AnimatePresence>
            {teams.map((team, index) => {
              const badgeStyle =
                TEAM_BADGE_STYLES[index % TEAM_BADGE_STYLES.length];
              return (
                <motion.div
                  key={team}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="glass-card p-5 flex items-center justify-between border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0f131d]/90 shadow-md dark:shadow-xl"
                >
                  <div className="flex items-center gap-4 truncate">
                    <span
                      className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center border shrink-0 ${badgeStyle.bg}`}
                    >
                      {badgeStyle.icon}
                    </span>
                    <span dir="auto" className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl truncate">
                      {team}
                    </span>
                  </div>

                  <button
                    onClick={() => removeTeam(team)}
                    className="w-9 h-9 rounded-full text-slate-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 flex items-center justify-center transition-colors text-base"
                    aria-label={`Remove ${team}`}
                    type="button"
                  >
                    ✕
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {teams.length === 0 && (
            <div className="col-span-full border border-dashed border-slate-300 dark:border-white/10 rounded-3xl p-10 text-center text-slate-700 dark:text-slate-400 text-base font-semibold bg-white/50 dark:bg-transparent">
              No teams registered yet. Type a name above or click <span className="text-violet-800 dark:text-violet-400 font-bold">Quick Preset Team Name</span>!
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      {teams.length >= 2 ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="btn-primary btn-emerald text-2xl px-12 py-6 rounded-2xl w-full sm:w-auto shadow-2xl"
        >
          🚀 Start Quiz Arena
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
