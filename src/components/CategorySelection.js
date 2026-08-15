import React from "react";
import { motion } from "framer-motion";

const CATEGORY_ICONS = ["📚", "🧪", "🌍", "💡", "🎨", "🚀", "⚡", "🧠"];

function CategorySelection({ categories, onSelect, completedCategories = [] }) {
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
      className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center"
    >
      <div className="text-center mb-10">
        <span className="inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-emerald-600 border border-emerald-500 mb-4 shadow-md">
          Stage 3 • Topic Selection ({completedCount}/{totalCount} Completed)
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4">
          Select <span className="text-gradient-cyan">Category Level</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-2xl max-w-2xl mx-auto font-medium">
          Choose an unlocked topic level to start the question round.
        </p>

        {/* Global Category Progress Bar */}
        <div className="w-full max-w-lg mx-auto mt-6 bg-slate-200 dark:bg-white/5 rounded-full h-3.5 p-0.5 border border-slate-300 dark:border-white/10 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
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

          return (
            <motion.button
              key={category.title}
              disabled={done}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={done ? {} : { y: -6, scale: 1.02 }}
              whileTap={done ? {} : { scale: 0.98 }}
              onClick={() => onSelect(category)}
              className={[
                "glass-card p-8 flex flex-col justify-between text-left transition-all duration-300 relative overflow-hidden group min-h-[220px]",
                done
                  ? "opacity-60 border-slate-300 dark:border-white/5 bg-slate-100/80 dark:bg-white/[0.02] cursor-not-allowed"
                  : "border-purple-200/90 dark:border-purple-500/30 hover:border-cyan-500 hover:shadow-[0_20px_40px_rgba(6,182,212,0.18)] dark:hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] cursor-pointer bg-white/95 dark:bg-[#120826]/95",
              ].join(" ")}
            >
              <div className="flex items-center justify-between w-full mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <span className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 flex items-center justify-center text-cyan-950 dark:text-cyan-400 font-black text-lg shrink-0">
                    L{index + 1}
                  </span>
                </div>

                <span
                  className={[
                    "text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border shadow-sm",
                    done
                      ? "bg-slate-400 text-white border-slate-400"
                      : "bg-cyan-600 text-white border-cyan-500",
                  ].join(" ")}
                >
                  {done ? "✓ Completed" : "Unlocked"}
                </span>
              </div>

              <div>
                <h3 dir="auto" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors mb-2">
                  {category.title}
                </h3>
                {category.description && (
                  <p dir="auto" className="text-base text-slate-700 dark:text-slate-400 line-clamp-2 font-medium">
                    {category.description}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default CategorySelection;
