import React from "react";
import { motion } from "framer-motion";

function ResetButton({ dispatch }) {
  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to restart the quiz? All current progress will be reset."
    );
    if (confirmReset) {
      dispatch({ type: "restart" });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleReset}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-700 hover:text-rose-900 dark:text-rose-300 dark:hover:text-rose-100 border border-rose-200 hover:border-rose-300 dark:border-rose-500/30 dark:hover:border-rose-500/50 rounded-full px-5 py-2.5 flex items-center gap-2.5 text-sm sm:text-base font-black shadow-md dark:shadow-[0_4_15px_rgba(244,63,94,0.15)] backdrop-blur-xl transition-all cursor-pointer"
      aria-label="Restart Quiz"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-rose-600 dark:text-rose-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clipRule="evenodd"
        />
      </svg>
      <span>Restart</span>
    </motion.button>
  );
}

export default ResetButton;
