import React from "react";
import Logo from "./Logo";
import StepProgress from "./StepProgress";
import Timer from "./Timer";

function Header({
  currentStatus,
  currentTeam,
  teams,
  index,
  numQuestions,
  currentCategoryTitle,
  dispatch = () => {},
  secondsRemaining = 0,
  isTimerPaused = false,
  secPerQuestion = 20,
}) {
  const isGameActive = currentStatus === "active";
  const currentStep = (index || 0) + 1;
  const progressPercent =
    numQuestions > 0
      ? Math.min(100, Math.max(0, (currentStep / numQuestions) * 100))
      : 0;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto glass-card px-5 py-2.5 flex items-center justify-between gap-4 shadow-2xl border-purple-200/80 dark:border-purple-500/30 backdrop-blur-xl bg-white/95 dark:bg-[#120826]/95 rounded-2xl relative overflow-hidden">
          {/* Brand Logo */}
          <Logo />

          {/* Center Content: Wayground Active Turn Team & Progress */}
          {isGameActive ? (
            <div className="flex items-center gap-3 justify-center">
              {currentTeam && (
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/35 shadow-sm">
                  <span className="text-lg">{currentTeam.avatar || "🎯"}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                      Turn:
                    </span>
                    <span dir="auto" className="text-sm font-black text-slate-900 dark:text-white">
                      {currentTeam.name}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-extrabold text-xs border border-amber-300 dark:border-amber-400/30 ml-1 shadow-sm">
                    ⭐ {currentTeam.score} pts
                  </span>
                </div>
              )}

              {numQuestions > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-400/30 text-cyan-900 dark:text-cyan-200 font-extrabold text-xs shadow-sm">
                  <span>📝</span>
                  <span>
                    Q {currentStep}/{numQuestions}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center max-w-md w-full">
              <StepProgress currentStatus={currentStatus} />
            </div>
          )}

          {/* Right Header Element: Timer */}
          <div className="flex items-center gap-2">
            {isGameActive ? (
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
                isTimerPaused={isTimerPaused}
                secPerQuestion={secPerQuestion}
              />
            ) : (
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-500/20 px-3.5 py-1.5 rounded-xl border border-purple-300 dark:border-purple-400/30 shadow-sm">
                🏆 Quizify Arena
              </span>
            )}
          </div>

          {/* Wayground Progress Bar along bottom edge */}
          {isGameActive && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-purple-100 dark:bg-purple-950/80">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16 sm:h-20" />
    </>
  );
}

export default Header;
