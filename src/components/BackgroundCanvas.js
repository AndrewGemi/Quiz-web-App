import React, { useMemo } from "react";
import { motion } from "framer-motion";

const SHAPES = ["▲", "●", "◆", "■", "★", "⚡", "✨", "✦", "🎮", "🏆"];

export default function BackgroundCanvas({ theme = "dark" }) {
  const isLight = theme === "light";

  // Pre-generate rich floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      shape: SHAPES[i % SHAPES.length],
      left: `${(i * 3.7 + 2) % 96}%`,
      top: `${(i * 5.3 + 4) % 94}%`,
      size: 16 + (i % 6) * 8,
      duration: 10 + (i % 5) * 3,
      delay: (i % 6) * 1.2,
      xOffset: (i % 2 === 0 ? 1 : -1) * (40 + (i % 4) * 30),
      yOffset: (i % 3 === 0 ? -1 : 1) * (50 + (i % 5) * 35),
      rotation: (i % 2 === 0 ? 360 : -360),
      color:
        i % 4 === 0
          ? "from-purple-500 to-indigo-500"
          : i % 4 === 1
          ? "from-cyan-400 to-blue-500"
          : i % 4 === 2
          ? "from-pink-500 to-rose-500"
          : "from-amber-400 to-yellow-500",
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Canvas Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight
            ? "bg-gradient-to-br from-[#f8fafc] via-[#ede9fe] to-[#e0f2fe]"
            : "bg-gradient-to-br from-[#0c041f] via-[#14062e] to-[#080114]"
        }`}
      />

      {/* ================= VIVID DYNAMIC GLOWING ORBS ================= */}

      {/* Nebula 1: Electric Violet / Purple Top-Left */}
      <motion.div
        animate={{
          x: [0, 120, -80, 50, 0],
          y: [0, -90, 70, -40, 0],
          scale: [1, 1.35, 0.85, 1.2, 1],
          rotate: [0, 45, -30, 20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-8%] left-[-6%] w-[650px] h-[650px] rounded-full blur-[70px] will-change-transform opacity-75 dark:opacity-80"
        style={{
          background: isLight
            ? "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(147,51,234,0.35) 45%, rgba(168,85,247,0) 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(109,40,217,0.45) 45%, rgba(139,92,246,0) 70%)",
        }}
      />

      {/* Nebula 2: Vibrant Cyan / Sapphire Top-Right */}
      <motion.div
        animate={{
          x: [0, -110, 90, -60, 0],
          y: [0, 100, -80, 50, 0],
          scale: [1, 1.3, 0.9, 1.25, 1],
          rotate: [0, -40, 35, -20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[75px] will-change-transform opacity-70 dark:opacity-75"
        style={{
          background: isLight
            ? "radial-gradient(circle, rgba(14,165,233,0.5) 0%, rgba(6,182,212,0.3) 45%, rgba(14,165,233,0) 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.65) 0%, rgba(3,105,161,0.4) 45%, rgba(6,182,212,0) 70%)",
        }}
      />

      {/* Nebula 3: Neon Hot Pink / Rose Bottom-Left */}
      <motion.div
        animate={{
          x: [0, 130, -70, 90, 0],
          y: [0, -80, 90, -50, 0],
          scale: [1, 1.25, 0.9, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[65px] will-change-transform opacity-65 dark:opacity-70"
        style={{
          background: isLight
            ? "radial-gradient(circle, rgba(244,63,94,0.45) 0%, rgba(236,72,153,0.25) 45%, rgba(244,63,94,0) 70%)"
            : "radial-gradient(circle, rgba(244,63,94,0.6) 0%, rgba(190,18,60,0.35) 45%, rgba(244,63,94,0) 70%)",
        }}
      />

      {/* Nebula 4: Warm Sun Amber / Gold Center Glow */}
      <motion.div
        animate={{
          x: [0, -60, 70, -50, 0],
          y: [0, 60, -60, 40, 0],
          scale: [0.9, 1.3, 0.8, 1.2, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4.5,
        }}
        className="absolute top-[40%] left-[35%] w-[550px] h-[550px] rounded-full blur-[80px] will-change-transform opacity-45 dark:opacity-55"
        style={{
          background: isLight
            ? "radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(245,158,11,0.2) 45%, rgba(251,191,36,0) 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(180,83,9,0.3) 45%, rgba(245,158,11,0) 70%)",
        }}
      />

      {/* ================= ANIMATED MOVING LIGHT BEAM WAVES ================= */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[50%] -left-[50%] w-[200vw] h-[200vh] opacity-25 dark:opacity-20 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            transparent 0deg, 
            rgba(168, 85, 247, 0.35) 60deg, 
            transparent 120deg, 
            rgba(6, 182, 212, 0.35) 180deg, 
            transparent 240deg, 
            rgba(244, 63, 94, 0.35) 300deg, 
            transparent 360deg)`,
        }}
      />

      {/* ================= PROMINENT FLOATING GAMING PARTICLES ================= */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 0.2,
              rotate: 0,
            }}
            animate={{
              x: [0, p.xOffset, -p.xOffset * 0.8, p.xOffset * 0.5, 0],
              y: [0, p.yOffset, -p.yOffset * 0.9, p.yOffset * 0.4, 0],
              rotate: [0, p.rotation],
              scale: [1, 1.25, 0.9, 1.15, 1],
              opacity: isLight
                ? [0.2, 0.55, 0.25, 0.5, 0.2]
                : [0.3, 0.75, 0.4, 0.7, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: p.left,
              top: p.top,
              fontSize: `${p.size}px`,
            }}
            className={`absolute font-black select-none pointer-events-none ${
              isLight
                ? "text-purple-600/80 drop-shadow-[0_2px_8px_rgba(147,51,234,0.35)]"
                : "text-purple-300 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]"
            }`}
          >
            {p.shape}
          </motion.div>
        ))}
      </div>

      {/* Subtle Digital Grid Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLight ? "opacity-[0.08]" : "opacity-[0.05]"
        }`}
        style={{
          backgroundImage: isLight
            ? `radial-gradient(rgba(15, 23, 42, 0.6) 1.5px, transparent 1.5px)`
            : `radial-gradient(rgba(255, 255, 255, 0.6) 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
}
