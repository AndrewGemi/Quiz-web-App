import React from "react";
import { motion } from "framer-motion";

export default function ExamModeSelection({ onPick }) {
  const modes = [
    {
      id: "trial",
      title: "Trial Exam",
      subtitle: "Standard practice mode using custom category pools and question points.",
      meta: "20s timer per question",
      icon: "⚡",
      badge: "Practice Mode",
      borderColor: "border-violet-200 dark:border-violet-500/30 hover:border-violet-500",
      glowColor: "hover:shadow-[0_20px_40px_rgba(124,58,237,0.18)] dark:hover:shadow-[0_0_35px_rgba(139,92,246,0.3)]",
      badgeBg: "bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-500/30",
    },
    {
      id: "shootout",
      title: "Penalty Shootout",
      subtitle: "Rapid-fire team battle! Fast turns with 1 point per correct answer.",
      meta: "20s timer per question",
      icon: "🔥",
      badge: "Team vs Team",
      borderColor: "border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-500",
      glowColor: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.18)] dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.3)]",
      badgeBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30",
    },
    {
      id: "real",
      title: "Official Exam",
      subtitle: "Full-scale competitive exam with the live official question bank.",
      meta: "20s timer per question",
      icon: "🏆",
      badge: "Official Tournament",
      borderColor: "border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-500",
      glowColor: "hover:shadow-[0_20px_40px_rgba(6,182,212,0.18)] dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]",
      badgeBg: "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/20 mb-4 shadow-md">
          Stage 1 • Experience Picker
        </span>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Choose Your <span className="text-gradient-purple">Exam Mode</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xl sm:text-3xl max-w-3xl mx-auto font-medium leading-relaxed">
          Select how you want to compete today. You can restart anytime to try a different mode.
        </p>
      </motion.div>

      {/* Cards Widescreen Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(mode.id)}
            className={`glass-card p-8 sm:p-10 flex flex-col justify-between cursor-pointer border ${mode.borderColor} ${mode.glowColor} transition-all duration-300 group`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {mode.icon}
                </span>
                <span
                  className={`text-xs sm:text-sm font-extrabold px-4 py-2 rounded-full border ${mode.badgeBg}`}
                >
                  {mode.badge}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                {mode.title}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 font-medium">
                {mode.subtitle}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-base text-slate-700 dark:text-slate-400 font-extrabold">
              <span>{mode.meta}</span>
              <span className="text-violet-700 dark:text-violet-400 text-xl font-black group-hover:translate-x-2 transition-transform">
                Select →
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
