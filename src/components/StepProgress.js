import React from "react";

const STEPS = [
  { id: "selectingExam", label: "Mode", icon: "⚡" },
  { id: "selectingTeams", label: "Teams", icon: "👥" },
  { id: "selectingCategory", label: "Topic", icon: "🎯" },
  { id: "active", label: "Quiz", icon: "🎮" },
];

export default function StepProgress({ currentStatus }) {
  const getStepIndex = (status) => {
    if (status === "selectingExam") return 0;
    if (status === "selectingTeams") return 1;
    if (status === "selectingCategory") return 2;
    if (status === "active" || status === "finished") return 3;
    return 0;
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full max-w-xl mx-auto hidden sm:flex items-center justify-between px-2 py-0.5">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-1.5">
              <div
                className={[
                  "w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center border transition-all duration-300 shadow-sm",
                  isCompleted
                    ? "bg-emerald-500 text-white dark:text-slate-950 border-emerald-400"
                    : isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)] scale-105"
                    : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-500 border-slate-300 dark:border-white/10",
                ].join(" ")}
              >
                {isCompleted ? "✓" : step.icon}
              </div>

              <span
                className={[
                  "text-[11px] font-extrabold tracking-tight transition-colors",
                  isActive
                    ? "text-violet-800 dark:text-violet-300"
                    : isCompleted
                    ? "text-emerald-800 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-500",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-500"
                  style={{
                    width: idx < activeIndex ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
