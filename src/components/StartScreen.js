import React from "react";
import { motion } from "framer-motion";
import { downloadExcelTemplate } from "../utils/excelHelper";

const HIGHLIGHTS = [
  {
    icon: "🏆",
    title: "Multi-Team Tournaments",
    description:
      "Register up to 8 teams with real-time scoring, slow-motion rank climb animations, and grand podium ceremonies.",
    color: "from-amber-500/20 to-yellow-500/10 border-amber-400/40 text-amber-950 dark:text-amber-300",
    badge: "Live Arena",
  },
  {
    icon: "📊",
    title: "Excel Question Import",
    description:
      "1-click import custom categories, questions, options, and points directly from Excel or CSV files.",
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-400/40 text-cyan-950 dark:text-cyan-300",
    badge: "Custom Content",
  },
  {
    icon: "⚡",
    title: "Custom Modes & Timers",
    description:
      "Choose from Trial Practice, Official Championship, and Rapid Penalty Shootout with customizable timer speeds.",
    color: "from-purple-500/20 to-indigo-500/10 border-purple-400/40 text-purple-950 dark:text-purple-300",
    badge: "Full Control",
  },
];

export default function StartScreen({
  onStart,
  onOpenExcelModal,
  customCategories,
  customSummary,
  onClearCustomCategories,
}) {
  const hasCustom = customCategories && customCategories.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center gap-10"
    >
      {/* ================= HERO SECTION ================= */}
      <div className="flex flex-col items-center text-center gap-4 max-w-4xl">
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 border border-purple-400/50 shadow-lg shadow-purple-500/25"
        >
          <span>🚀</span>
          <span>The Live Quiz & Tournament Platform</span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]"
        >
          Welcome to <span className="text-gradient-purple">Quizify</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-2xl text-slate-700 dark:text-slate-300 font-semibold max-w-3xl leading-relaxed"
        >
          Host thrilling multiplayer quiz battles, custom category championships,
          and live team tournaments with real-time scoring.
        </motion.p>
      </div>

      {/* ================= CALL TO ACTION BUTTONS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl"
      >
        {/* Primary Start Game Button */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 45px rgba(139, 92, 246, 0.6)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="btn-primary text-xl sm:text-2xl font-black px-10 py-5 rounded-2xl shadow-2xl w-full sm:w-auto flex items-center justify-center gap-3.5 cursor-pointer"
        >
          <span>🎮</span>
          <span>Start New Tournament</span>
          <span className="text-2xl">➔</span>
        </motion.button>

        {/* Secondary Import Excel Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenExcelModal}
          className="btn-secondary text-base sm:text-lg font-black px-7 py-5 rounded-2xl border-2 border-purple-300 dark:border-purple-500/40 text-purple-950 dark:text-purple-200 bg-white/90 dark:bg-purple-950/40 hover:bg-purple-50 dark:hover:bg-purple-900/40 shadow-lg w-full sm:w-auto flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>📁</span>
          <span>{hasCustom ? "Manage Excel Questions" : "Import Excel File"}</span>
        </motion.button>
      </motion.div>

      {/* ================= CUSTOM QUESTIONS LOADED STATUS (IF ANY) ================= */}
      {hasCustom && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl glass-card p-4 sm:p-5 rounded-2xl border-2 border-emerald-400 dark:border-emerald-500/50 bg-emerald-50/90 dark:bg-emerald-950/40 shadow-md flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl shrink-0">📊</span>
            <div className="min-w-0">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Custom Question Bank Active
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {customSummary?.totalCategories || customCategories.length} Categories •{" "}
                {customSummary?.totalQuestions || "Custom"} Questions Loaded
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenExcelModal}
              className="text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Change
            </button>
            {onClearCustomCategories && (
              <button
                type="button"
                onClick={onClearCustomCategories}
                className="text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                title="Reset to default questions"
              >
                ✕ Reset
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ================= FEATURE HIGHLIGHT CARDS ================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {HIGHLIGHTS.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + idx * 0.1 }}
            className="glass-card p-6 sm:p-7 rounded-3xl border-2 border-purple-200/90 dark:border-purple-500/30 bg-white/95 dark:bg-[#120826]/95 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-purple-400 dark:hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-400/30">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Template Download Footer Link */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-bold">
        <span>Need a template for your questions?</span>
        <button
          type="button"
          onClick={downloadExcelTemplate}
          className="text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1 font-black cursor-pointer"
        >
          <span>📥 Download Sample Excel Template (.xlsx)</span>
        </button>
      </div>
    </motion.div>
  );
}
