import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ResetButton({ dispatch }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleConfirm() {
    setShowConfirm(false);
    dispatch({ type: "restart" });
  }

  return (
    <>
      {/* Floating Restart Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 bg-rose-50/95 hover:bg-rose-100 dark:bg-rose-950/80 dark:hover:bg-rose-900/90 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 text-xs sm:text-sm font-black shadow-lg dark:shadow-[0_4px_20px_rgba(244,63,94,0.25)] backdrop-blur-xl transition-all cursor-pointer"
        aria-label="Restart Quiz"
        type="button"
      >
        <span className="text-base">🔄</span>
        <span>Restart Game</span>
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-md glass-card p-6 sm:p-8 rounded-3xl border-2 border-rose-300/80 dark:border-rose-500/40 bg-white/95 dark:bg-[#150a21]/95 shadow-2xl flex flex-col items-center text-center gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30 flex items-center justify-center text-2xl shadow-inner">
                ⚠️
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Restart Tournament?
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                  All active team scores, round progress, and category standings will be reset to the beginning.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 font-black text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Yes, Restart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ResetButton;
