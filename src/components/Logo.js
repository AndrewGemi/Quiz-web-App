import React from "react";
import { motion } from "framer-motion";

function Logo() {
  return (
    <motion.div
      className="logo flex items-center gap-2 cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 blur-sm opacity-50 group-hover:opacity-80 transition-opacity" />
        
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 p-[1px] shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-[11px] bg-white dark:bg-[#0f131d] flex items-center justify-center transition-colors">
            <svg
              className="w-4 h-4 text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors font-['Outfit']">
        Quiz<span className="text-gradient-purple">ify</span>
      </h1>
    </motion.div>
  );
}

export default Logo;
