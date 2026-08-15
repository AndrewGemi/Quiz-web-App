import React from "react";

function Logo() {
  return (
    <div className="logo flex items-center gap-2.5 select-none">
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 blur-md opacity-40 dark:opacity-60" />
        
        {/* Solid Gradient Icon Badge */}
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 shadow-md shadow-purple-500/25 flex items-center justify-center text-white ring-1 ring-white/20">
          <svg
            className="w-4 h-4 text-white"
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

      <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-['Outfit']">
        Quiz<span className="text-gradient-purple">ify</span>
      </span>
    </div>
  );
}

export default Logo;
