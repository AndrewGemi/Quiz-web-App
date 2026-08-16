import React, { useState } from "react";
import { motion } from "framer-motion";
import { downloadExcelTemplate } from "../utils/excelHelper";

const TIMER_PRESETS = [10, 15, 20, 30, 45, 60];

export default function ExamModeSelection({
  onPick,
  onBack,
  onOpenExcelModal,
  customCategories,
  customSummary,
  onClearCustomCategories,
  secsPerQuestion = 20,
  onSetSecsPerQuestion,
}) {
  const [customTimer, setCustomTimer] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const hasCustomQuestions = customCategories && customCategories.length > 0;

  const modes = [
    {
      id: "trial",
      title: "Trial Exam",
      subtitle: hasCustomQuestions
        ? "Play standard category rounds using your imported Excel questions."
        : "Standard practice mode using custom category pools and question points.",
      meta: `${secsPerQuestion}s per question`,
      icon: "⚡",
      badge: "Practice Mode",
      borderColor: "border-violet-200 dark:border-violet-500/30 hover:border-violet-500",
      glowColor: "hover:shadow-[0_20px_40px_rgba(124,58,237,0.18)] dark:hover:shadow-[0_0_35px_rgba(139,92,246,0.3)]",
      badgeBg: "bg-violet-600 dark:bg-violet-600 text-white border border-violet-500 font-black shadow-sm",
    },
    {
      id: "real",
      title: "Official Exam",
      subtitle: hasCustomQuestions
        ? "Full tournament competition using your imported Excel question bank."
        : "Full-scale competitive exam with the live official question bank.",
      meta: `${secsPerQuestion}s per question`,
      icon: "🏆",
      badge: "Official Tournament",
      borderColor: "border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-500",
      glowColor: "hover:shadow-[0_20px_40px_rgba(6,182,212,0.18)] dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]",
      badgeBg: "bg-cyan-600 dark:bg-cyan-600 text-white border border-cyan-500 font-black shadow-sm",
    },
    {
      id: "shootout",
      title: "Penalty Shootout",
      subtitle: "Rapid-fire team battle! Fast turns with 1 point per correct answer.",
      meta: `${secsPerQuestion}s per question`,
      icon: "🔥",
      badge: "Team vs Team",
      borderColor: "border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-500",
      glowColor: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.18)] dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.3)]",
      badgeBg: "bg-emerald-600 dark:bg-emerald-600 text-white border border-emerald-500 font-black shadow-sm",
    },
  ];

  function handleSelectTimer(seconds) {
    if (onSetSecsPerQuestion) {
      onSetSecsPerQuestion(seconds);
    }
  }

  function handleCustomTimerSubmit(e) {
    if (e) e.preventDefault();
    const val = parseInt(customTimer, 10);
    if (!isNaN(val) && val >= 5 && val <= 300) {
      handleSelectTimer(val);
      setShowCustomInput(false);
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top Back Navigation */}
      {onBack && (
        <div className="w-full max-w-5xl flex items-center justify-start mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-purple-950/60 border border-slate-300 dark:border-purple-500/30 text-slate-800 dark:text-purple-200 font-black text-sm hover:bg-slate-200 dark:hover:bg-purple-900/60 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>🏠</span>
            <span>Back to Welcome</span>
          </motion.button>
        </div>
      )}
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-purple-600 border border-purple-500 mb-4 shadow-md">
          Stage 1 • Exam Mode & Setup
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Choose Your <span className="text-gradient-purple">Exam Mode</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
          Import your questions from Excel or use the default bank, set your timer, and choose your mode.
        </p>
      </motion.div>

      {/* Question Bank Source & Import Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl glass-card p-5 sm:p-6 mb-6 border-2 border-purple-200/90 dark:border-purple-500/30 bg-white/95 dark:bg-[#120826]/95 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 text-center md:text-left min-w-0">
          <span className="text-3xl sm:text-4xl shrink-0">
            {hasCustomQuestions ? "📊" : "📚"}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-300">
                Question Source
              </span>
              {hasCustomQuestions ? (
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 font-black text-xs">
                  ✅ Custom Excel Loaded
                </span>
              ) : (
                <span className="px-3 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-black text-xs">
                  Default Question Bank
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {hasCustomQuestions
                ? `${customSummary?.totalCategories || customCategories.length} Categories (${customSummary?.totalQuestions || "Custom"} Questions)`
                : "Built-in Official & Practice Question Pool"}
            </h3>
          </div>
        </div>

        {/* Import / Change Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenExcelModal}
            className="btn-secondary text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-purple-300 dark:border-purple-400/40 text-purple-950 dark:text-purple-200 bg-purple-50 dark:bg-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/30 flex items-center gap-2 font-black shadow-sm"
          >
            <span>📁</span>
            <span>{hasCustomQuestions ? "Change Excel File" : "Import from Excel"}</span>
          </button>

          {hasCustomQuestions && onClearCustomCategories && (
            <button
              type="button"
              onClick={onClearCustomCategories}
              className="text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 font-black transition-colors"
              title="Reset to default questions"
            >
              ✕ Reset
            </button>
          )}

          <button
            type="button"
            onClick={downloadExcelTemplate}
            className="btn-secondary text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-1.5 font-extrabold shadow-sm"
            title="Download formatted Excel template"
          >
            <span>📥</span>
            <span>Template (.xlsx)</span>
          </button>
        </div>
      </motion.div>

      {/* Pre-Game Timer Customization Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-5xl glass-card p-5 sm:p-6 mb-8 border-2 border-purple-200/90 dark:border-purple-500/30 bg-white/95 dark:bg-[#120826]/95 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-5"
      >
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <span className="text-3xl sm:text-4xl">⏱️</span>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-300">
                Pre-Game Settings
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600 dark:bg-violet-500/30 text-white dark:text-violet-200 border border-violet-500 dark:border-violet-400/40 font-black text-xs shadow-md shadow-violet-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{secsPerQuestion}s Active</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Timer Duration per Question
            </h3>
          </div>
        </div>

        {/* Timer Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TIMER_PRESETS.map((seconds) => {
            const isSelected = secsPerQuestion === seconds && !showCustomInput;
            return (
              <button
                key={seconds}
                type="button"
                onClick={() => {
                  setShowCustomInput(false);
                  handleSelectTimer(seconds);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-sm font-black transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30 scale-105 border border-violet-500"
                    : "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-white/15 hover:bg-slate-200 dark:hover:bg-white/20"
                }`}
              >
                {seconds}s
              </button>
            );
          })}

          {/* Custom Timer Trigger */}
          {showCustomInput ? (
            <form onSubmit={handleCustomTimerSubmit} className="flex items-center gap-1.5">
              <input
                type="number"
                min="5"
                max="300"
                value={customTimer}
                onChange={(e) => setCustomTimer(e.target.value)}
                placeholder="Secs (5-300)"
                className="w-24 px-3 py-1.5 rounded-xl border border-violet-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-sm focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-black shadow-sm"
              >
                Set
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className={`px-3.5 py-2 rounded-xl text-sm font-black transition-all ${
                !TIMER_PRESETS.includes(secsPerQuestion)
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md border border-violet-500"
                  : "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-white/15 hover:bg-slate-200 dark:hover:bg-white/20"
              }`}
            >
              Custom ✏️
            </button>
          )}
        </div>
      </motion.div>

      {/* 3 Core Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(mode.id)}
            className={`glass-card p-7 sm:p-8 flex flex-col justify-between cursor-pointer border ${mode.borderColor} ${mode.glowColor} transition-all duration-300 group`}
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
                  {mode.icon}
                </span>
                <span
                  className={`text-[11px] sm:text-xs font-black px-3 py-1 rounded-full border ${mode.badgeBg}`}
                >
                  {mode.badge}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2.5 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                {mode.title}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                {mode.subtitle}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-black">
                ⏱️ {mode.meta}
              </span>
              <span className="text-violet-700 dark:text-violet-400 text-base font-black group-hover:translate-x-1.5 transition-transform">
                Select Mode →
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
