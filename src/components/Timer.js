import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FullscreenButton({ className = "" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    document.addEventListener("webkitfullscreenchange", handleFs);
    return () => {
      document.removeEventListener("fullscreenchange", handleFs);
      document.removeEventListener("webkitfullscreenchange", handleFs);
    };
  }, []);

  const toggleFs = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleFs}
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      className={`glass-card p-2.5 rounded-2xl border border-purple-200/90 dark:border-purple-500/30 backdrop-blur-xl bg-white/95 dark:bg-[#120826]/90 text-purple-700 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-purple-600/30 hover:border-purple-300 dark:hover:border-purple-400/50 shadow-md dark:shadow-xl transition-all flex items-center justify-center cursor-pointer ${className}`}
    >
      {isFullscreen ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0l5 0M4 4l0 5m11 0l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5m11 5l5-5m0 0l-5 0m5 0l0 5" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </motion.button>
  );
}

export function ThemeToggle({ theme = "dark", onToggle, className = "" }) {
  const isLight = theme === "light";

  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      className={`glass-card p-2.5 rounded-2xl border backdrop-blur-xl transition-all flex items-center justify-center cursor-pointer ${
        isLight
          ? "bg-amber-100/90 border-amber-300/80 text-amber-800 hover:bg-amber-200 shadow-md"
          : "bg-[#120826]/90 border-purple-500/30 text-amber-300 hover:text-amber-200 hover:bg-purple-600/30 shadow-xl"
      } ${className}`}
    >
      {isLight ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </motion.button>
  );
}

function Timer({
  dispatch = () => {},
  secondsRemaining = 0,
  isTimerPaused = false,
  secPerQuestion = 20,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const minutes = Math.floor(Math.max(0, secondsRemaining) / 60);
  const seconds = Math.max(0, secondsRemaining) % 60;

  const total = secPerQuestion || 20;
  const radius = 22; // Center 32, radius 22 -> stroke outer edge at 32 + 22 + 2.25 = 56.25px (well within 64px SVG bounds)
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, secondsRemaining) / total;
  const strokeDashoffset = circumference * (1 - progress);

  const beepRef = useRef(null);
  const timesUpRef = useRef(null);
  const prevSecRef = useRef(secondsRemaining);
  const playTokenRef = useRef(0);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    document.addEventListener("webkitfullscreenchange", handleFs);
    return () => {
      document.removeEventListener("fullscreenchange", handleFs);
      document.removeEventListener("webkitfullscreenchange", handleFs);
    };
  }, []);

  const toggleFs = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    beepRef.current = new Audio(`${process.env.PUBLIC_URL || ""}/sounds/beep.mp3`);
    timesUpRef.current = new Audio(`${process.env.PUBLIC_URL || ""}/sounds/timesup.mp3`);

    [beepRef.current, timesUpRef.current].forEach((a) => {
      if (!a) return;
      a.preload = "auto";
      a.playsInline = true;
      a.volume = 0.6;
    });

    return () => {
      [beepRef.current, timesUpRef.current].forEach((a) => {
        if (!a) return;
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const stopAllAudio = useCallback(() => {
    playTokenRef.current++;
    [beepRef.current, timesUpRef.current].forEach((a) => {
      if (!a) return;
      a.pause();
      try {
        a.currentTime = 0;
      } catch {}
    });
  }, []);

  useEffect(() => {
    if (typeof dispatch !== "function") return;
    const id = setInterval(() => {
      if (typeof dispatch === "function") {
        dispatch({ type: "tick" });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    if (isTimerPaused) stopAllAudio();
  }, [isTimerPaused, stopAllAudio]);

  useEffect(() => {
    const prev = prevSecRef.current;
    prevSecRef.current = secondsRemaining;

    if (prev === secondsRemaining) return;
    if (isTimerPaused) return;
    if (secondsRemaining < 0) return;

    if (secondsRemaining === 5) {
      const token = ++playTokenRef.current;
      const a = beepRef.current;
      if (a) {
        a.currentTime = 0;
        a.play()
          .then(() => {
            if (token !== playTokenRef.current || isTimerPaused) a.pause();
          })
          .catch(() => {});
      }
    }

    if (secondsRemaining === 0) {
      if (beepRef.current) beepRef.current.pause();
      if (timesUpRef.current) {
        timesUpRef.current.currentTime = 0;
        timesUpRef.current.play().catch(() => {});
      }
    }
  }, [secondsRemaining, isTimerPaused]);

  const isLow = secondsRemaining <= 5 && secondsRemaining > 0;
  const isDanger = secondsRemaining <= 3 && secondsRemaining > 0;

  const colorClass = isDanger
    ? "text-rose-600 dark:text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)] dark:drop-shadow-[0_0_12px_rgba(244,63,94,0.95)]"
    : isLow
    ? "text-amber-600 dark:text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)] dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]"
    : "text-cyan-700 dark:text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] dark:drop-shadow-[0_0_12px_rgba(6,182,212,0.95)]";

  const statusText = isDanger
    ? "🔥 CRITICAL"
    : isLow
    ? "⚠️ LOW TIME"
    : isTimerPaused
    ? "⏸ PAUSED"
    : "⚡ TICKING";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: -15 }}
      animate={
        isDanger
          ? {
              opacity: 1,
              y: 0,
              scale: [1, 1.04, 1],
              transition: {
                scale: { repeat: Infinity, duration: 0.5, ease: "easeInOut" },
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
              },
            }
          : { opacity: 1, scale: 1, y: 0 }
      }
      className={`glass-card px-4 py-3 inline-flex items-center gap-3.5 border-2 shadow-lg dark:shadow-[0_12px_35px_rgba(0,0,0,0.6)] rounded-2xl backdrop-blur-xl bg-white/95 dark:bg-[#160b2e]/95 relative transition-all duration-300 ${
        isDanger
          ? "border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)] dark:shadow-[0_0_40px_rgba(244,63,94,0.6)] bg-rose-50/90 dark:bg-rose-950/60"
          : isLow
          ? "border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] dark:shadow-[0_0_30px_rgba(245,158,11,0.4)] bg-amber-50/90 dark:bg-amber-950/40"
          : "border-purple-200/90 dark:border-purple-500/40 hover:border-purple-400/60"
      }`}
    >
      {/* Background Animated Pulse Glow for Low/Danger */}
      {(isDanger || isLow) && (
        <motion.div
          animate={{ opacity: [0.2, 0.75, 0.2], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className={`absolute inset-0 pointer-events-none rounded-2xl ${
            isDanger ? "bg-rose-500/10 dark:bg-rose-500/15" : "bg-amber-500/10 dark:bg-amber-500/15"
          }`}
        />
      )}

      {/* Cyberpunk Precision Circular Gauge Container */}
      <div className="relative flex items-center justify-center w-16 h-16 shrink-0 p-1">
        {/* Continuous Rotating Dashboard Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
          className="absolute inset-1 rounded-full border border-dashed border-purple-300 dark:border-purple-400/30 pointer-events-none"
        />

        {/* Pulse wave ring on tick */}
        {!isTimerPaused && (
          <motion.div
            key={`pulse-ring-${secondsRemaining}`}
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute inset-1 rounded-full border ${
              isDanger
                ? "border-rose-500"
                : isLow
                ? "border-amber-400"
                : "border-cyan-400"
            }`}
          />
        )}

        <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg]">
          <defs>
            <linearGradient id="timerGradNormal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="timerGradLow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="timerGradDanger" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Clock Notch Markers (12 Radial Lines inside circle) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 32 + 18 * Math.cos(angle);
            const y1 = 32 + 18 * Math.sin(angle);
            const x2 = 32 + 20.5 * Math.cos(angle);
            const y2 = 32 + 20.5 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={i % 3 === 0 ? "stroke-slate-400/80 dark:stroke-white/55" : "stroke-slate-300/80 dark:stroke-white/25"}
                strokeWidth={i % 3 === 0 ? "1.5" : "1"}
              />
            );
          })}

          {/* Background rail circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            className="stroke-slate-200 dark:stroke-white/10"
            strokeWidth="4"
          />

          {/* Animated active gradient stroke */}
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={
              isDanger
                ? "url(#timerGradDanger)"
                : isLow
                ? "url(#timerGradLow)"
                : "url(#timerGradNormal)"
            }
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "linear" }}
          />
        </svg>

        {/* Pulsing Countdown Seconds Number inside ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`sec-${secondsRemaining}`}
              initial={{ scale: 1.3, opacity: 0.5, filter: "blur(2px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`font-black text-base tracking-tight font-['Outfit'] ${colorClass}`}
            >
              {seconds}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Formatted Time Display & Live Status Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-800 dark:text-purple-300 leading-none">
            Timer
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border leading-none ${
              isDanger
                ? "bg-rose-100 dark:bg-rose-500/20 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 animate-pulse"
                : isLow
                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 animate-pulse"
                : isTimerPaused
                ? "bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-500/40"
                : "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40"
            }`}
          >
            {statusText}
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`time-text-${secondsRemaining}`}
            initial={{ y: -2, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={`font-black text-2xl tracking-tight leading-none font-['Outfit'] ${colorClass}`}
          >
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Action Controls & Equalizer */}
      <div className="flex items-center gap-1.5 ml-1">
        {/* Animated Equalizer Visualizer when sound is on and timer ticking */}
        {!isMuted && !isTimerPaused && secondsRemaining > 0 && (
          <div className="hidden sm:flex items-center gap-0.5 h-4 px-1">
            <motion.span
              animate={{ height: ["20%", "90%", "30%", "100%", "20%"] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
              className="w-0.5 bg-cyan-600 dark:bg-cyan-400/80 rounded-full"
            />
            <motion.span
              animate={{ height: ["70%", "20%", "100%", "40%", "70%"] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
              className="w-0.5 bg-purple-600 dark:bg-purple-400/80 rounded-full"
            />
            <motion.span
              animate={{ height: ["40%", "100%", "20%", "80%", "40%"] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
              className="w-0.5 bg-pink-600 dark:bg-pink-400/80 rounded-full"
            />
          </div>
        )}

        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.12, boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: "toggleTimer" })}
          disabled={secondsRemaining === 0}
          title={secondsRemaining === 0 ? "Time's up" : isTimerPaused ? "Resume timer" : "Pause timer"}
          aria-label={secondsRemaining === 0 ? "Time's up" : isTimerPaused ? "Resume timer" : "Pause timer"}
          className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/30 hover:bg-purple-200 dark:hover:bg-purple-500/40 flex items-center justify-center text-xs text-purple-900 dark:text-white transition-all shadow-sm cursor-pointer"
        >
          {secondsRemaining === 0 ? "⏱" : isTimerPaused ? "▶" : "⏸"}
        </motion.button>

        {/* Audio Mute Button */}
        <motion.button
          whileHover={{ scale: 1.12, boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsMuted((prev) => !prev);
            const muted = !(beepRef.current?.muted || false);
            if (beepRef.current) beepRef.current.muted = muted;
            if (timesUpRef.current) timesUpRef.current.muted = muted;
          }}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/30 hover:bg-purple-200 dark:hover:bg-purple-500/40 flex items-center justify-center text-xs text-purple-900 dark:text-white transition-all shadow-sm cursor-pointer"
        >
          {isMuted ? "🔇" : "🔊"}
        </motion.button>

        {/* Fullscreen Button */}
        <motion.button
          whileHover={{ scale: 1.12, boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFs}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/30 hover:bg-purple-200 dark:hover:bg-purple-500/40 flex items-center justify-center text-xs text-purple-900 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white transition-all shadow-sm cursor-pointer"
        >
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0l5 0M4 4l0 5m11 0l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5m11 5l5-5m0 0l-5 0m5 0l0 5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Timer;
