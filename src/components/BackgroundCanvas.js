import React, { useMemo } from "react";

const SHAPES = ["▲", "●", "◆", "■", "★", "⚡", "✨", "✦", "🎮", "🏆"];
const GLISTER_ICONS = ["✦", "✧", "✨", "★", "✴", "✸"];

const TRAIL_PALETTES = {
  dark: [
    {
      trail: "linear-gradient(90deg, #ffffff 0%, rgba(168,85,247,0.9) 25%, rgba(56,189,248,0.4) 65%, transparent 100%)",
      glow: "0 0 8px 1px #ffffff, 0 0 16px 2px rgba(168,85,247,0.8)",
      head: "#ffffff",
    },
    {
      trail: "linear-gradient(90deg, #ffffff 0%, rgba(6,182,212,0.9) 25%, rgba(16,185,129,0.4) 65%, transparent 100%)",
      glow: "0 0 7px 1px #ffffff, 0 0 14px 2px rgba(6,182,212,0.8)",
      head: "#ffffff",
    },
    {
      trail: "linear-gradient(90deg, #ffffff 0%, rgba(251,191,36,0.9) 25%, rgba(244,63,94,0.4) 65%, transparent 100%)",
      glow: "0 0 9px 2px #ffffff, 0 0 18px 3px rgba(251,191,36,0.8)",
      head: "#ffffff",
    },
    {
      trail: "linear-gradient(90deg, #ffffff 0%, rgba(244,63,94,0.9) 25%, rgba(251,191,36,0.4) 65%, transparent 100%)",
      glow: "0 0 8px 1px #ffffff, 0 0 16px 2px rgba(244,63,94,0.8)",
      head: "#ffffff",
    },
    {
      trail: "linear-gradient(90deg, #ffffff 0%, rgba(14,165,233,0.9) 25%, rgba(99,102,241,0.4) 65%, transparent 100%)",
      glow: "0 0 7px 1px #ffffff, 0 0 13px 2px rgba(14,165,233,0.8)",
      head: "#ffffff",
    },
  ],
  light: [
    {
      trail: "linear-gradient(90deg, #7c3aed 0%, rgba(168,85,247,0.75) 25%, rgba(14,165,233,0.3) 65%, transparent 100%)",
      glow: "0 0 8px rgba(124,58,237,0.6)",
      head: "#7c3aed",
    },
    {
      trail: "linear-gradient(90deg, #0284c7 0%, rgba(6,182,212,0.75) 25%, rgba(16,185,129,0.3) 65%, transparent 100%)",
      glow: "0 0 8px rgba(2,132,199,0.6)",
      head: "#0284c7",
    },
    {
      trail: "linear-gradient(90deg, #d97706 0%, rgba(245,158,11,0.75) 25%, rgba(225,29,72,0.3) 65%, transparent 100%)",
      glow: "0 0 8px rgba(217,119,6,0.6)",
      head: "#d97706",
    },
    {
      trail: "linear-gradient(90deg, #e11d48 0%, rgba(244,63,94,0.75) 25%, rgba(245,158,11,0.3) 65%, transparent 100%)",
      glow: "0 0 8px rgba(225,29,72,0.6)",
      head: "#e11d48",
    },
  ],
};

const TRAJECTORIES = ["meteor-star-1", "meteor-star-2", "meteor-star-3"];
const DRIFT_CLASSES = [
  "animate-glister-drift-1",
  "animate-glister-drift-2",
  "animate-glister-drift-3",
];

export default function BackgroundCanvas({ theme = "dark" }) {
  const isLight = theme === "light";

  // Procedurally randomize 12 cosmic meteors with negative delays (already in mid-flight on initial render)
  const meteors = useMemo(() => {
    const palette = isLight ? TRAIL_PALETTES.light : TRAIL_PALETTES.dark;
    const count = 12;

    return Array.from({ length: count }, (_, i) => {
      const isTopSpawn = i % 3 !== 2;
      let left, top;

      if (isTopSpawn) {
        const baseLeft = (i / (count * 0.65)) * 105 - 5;
        const jitterLeft = (Math.sin(i * 13.7) * 8).toFixed(1);
        left = `${Math.max(-8, Math.min(115, baseLeft + parseFloat(jitterLeft)))}%`;
        top = `${-60 - (i % 4) * 20}px`;
      } else {
        left = `${104 + (i % 3) * 3}%`;
        top = `${10 + ((i * 29.3) % 75)}%`;
      }

      const duration = 9.2 + ((i * 1.7) % 5.6);
      const delay = -(((i * 3.4 + (i % 5) * 1.8) % 36) + 0.5).toFixed(1);
      const trailWidth = 130 + ((i * 23.5) % 100);
      const animClass = TRAJECTORIES[i % TRAJECTORIES.length];
      const color = palette[i % palette.length];
      const headSize = `${2.0 + (i % 3) * 0.6}px`;

      return {
        id: i,
        left,
        top,
        duration: `${duration.toFixed(1)}s`,
        delay: `${delay}s`,
        trailWidth: `${trailWidth.toFixed(0)}px`,
        animClass,
        headSize,
        headGlow: color.glow,
        headBg: color.head,
        trailBackground: color.trail,
      };
    });
  }, [isLight]);

  // 22 dynamically moving & drifting glistering sparkles
  const glisters = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => {
      const isStarShape = i % 2 === 0;
      const left = `${(i * 13.7 + 4) % 94}%`;
      const top = `${(i * 17.3 + 6) % 92}%`;
      const duration = (5.5 + (i % 5) * 0.9).toFixed(1);
      // Negative delays for continuous drifting motion from frame 0
      const delay = -(((i * 1.35) % 8.5) + 0.4).toFixed(1);
      const size = isStarShape ? 11 + (i % 4) * 4 : 3.5 + (i % 3) * 1.5;

      const animClass = DRIFT_CLASSES[i % DRIFT_CLASSES.length];

      const colorClass =
        i % 4 === 0
          ? "text-purple-400/80 dark:text-purple-300/90 shadow-purple-500/50"
          : i % 4 === 1
          ? "text-cyan-400/80 dark:text-cyan-200/90 shadow-cyan-500/50"
          : i % 4 === 2
          ? "text-amber-400/80 dark:text-amber-200/90 shadow-amber-500/50"
          : "text-pink-400/80 dark:text-pink-200/90 shadow-pink-500/50";

      return {
        id: i,
        isStarShape,
        icon: GLISTER_ICONS[i % GLISTER_ICONS.length],
        left,
        top,
        size,
        duration: `${duration}s`,
        delay: `${delay}s`,
        animClass,
        colorClass,
      };
    });
  }, []);

  // Lightweight floating gaming particles with negative delays
  const particles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      shape: SHAPES[i % SHAPES.length],
      left: `${(i * 7.3 + 3) % 94}%`,
      top: `${(i * 11.1 + 5) % 90}%`,
      size: 16 + (i % 4) * 8,
      duration: 12 + (i % 4) * 3,
      delay: -(((i * 2.1) % 12) + 0.3).toFixed(1),
      animClass:
        i % 3 === 0
          ? "animate-float-1"
          : i % 3 === 1
          ? "animate-float-2"
          : "animate-float-3",
      colorClass:
        i % 4 === 0
          ? "text-purple-400/60 dark:text-purple-300/70"
          : i % 4 === 1
          ? "text-cyan-500/60 dark:text-cyan-300/70"
          : i % 4 === 2
          ? "text-pink-500/60 dark:text-pink-300/70"
          : "text-amber-500/60 dark:text-amber-300/70",
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none isolate transform-gpu animate-canvas-fade">
      {/* Base Canvas Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight
            ? "bg-gradient-to-br from-[#f8fafc] via-[#ede9fe] to-[#e0f2fe]"
            : "bg-gradient-to-br from-[#0c041f] via-[#14062e] to-[#080114]"
        }`}
      />

      {/* Nebula 1: Electric Violet / Purple Top-Left */}
      <div
        className="absolute top-[-10%] left-[-8%] w-[580px] h-[580px] rounded-full animate-orb-1 opacity-70 dark:opacity-80 will-change-transform"
        style={{
          animationDelay: "-3s",
          background: isLight
            ? "radial-gradient(circle at center, rgba(168,85,247,0.45) 0%, rgba(147,51,234,0.2) 40%, rgba(168,85,247,0) 70%)"
            : "radial-gradient(circle at center, rgba(139,92,246,0.65) 0%, rgba(109,40,217,0.3) 40%, rgba(139,92,246,0) 70%)",
        }}
      />

      {/* Nebula 2: Vibrant Cyan / Sapphire Top-Right */}
      <div
        className="absolute top-[15%] right-[-10%] w-[600px] h-[600px] rounded-full animate-orb-2 opacity-65 dark:opacity-75 will-change-transform"
        style={{
          animationDelay: "-7s",
          background: isLight
            ? "radial-gradient(circle at center, rgba(14,165,233,0.4) 0%, rgba(6,182,212,0.18) 40%, rgba(14,165,233,0) 70%)"
            : "radial-gradient(circle at center, rgba(6,182,212,0.6) 0%, rgba(3,105,161,0.25) 40%, rgba(6,182,212,0) 70%)",
        }}
      />

      {/* Nebula 3: Neon Hot Pink / Rose Bottom-Left */}
      <div
        className="absolute bottom-[-10%] left-[8%] w-[540px] h-[540px] rounded-full animate-orb-3 opacity-60 dark:opacity-70 will-change-transform"
        style={{
          animationDelay: "-11s",
          background: isLight
            ? "radial-gradient(circle at center, rgba(244,63,94,0.35) 0%, rgba(236,72,153,0.15) 40%, rgba(244,63,94,0) 70%)"
            : "radial-gradient(circle at center, rgba(244,63,94,0.55) 0%, rgba(190,18,60,0.2) 40%, rgba(244,63,94,0) 70%)",
        }}
      />

      {/* Nebula 4: Warm Sun Amber / Gold Center Glow */}
      <div
        className="absolute top-[35%] left-[30%] w-[480px] h-[480px] rounded-full animate-orb-1 opacity-40 dark:opacity-50 will-change-transform"
        style={{
          background: isLight
            ? "radial-gradient(circle at center, rgba(251,191,36,0.35) 0%, rgba(245,158,11,0.12) 40%, rgba(251,191,36,0) 70%)"
            : "radial-gradient(circle at center, rgba(245,158,11,0.45) 0%, rgba(180,83,9,0.18) 40%, rgba(245,158,11,0) 70%)",
          animationDelay: "-15s",
        }}
      />

      {/* Moving & Drifting Glistering Sparkles (GPU Composited 60+ FPS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {glisters.map((g) => (
          g.isStarShape ? (
            <span
              key={`glister-${g.id}`}
              style={{
                left: g.left,
                top: g.top,
                fontSize: `${g.size}px`,
                animationDuration: g.duration,
                animationDelay: `${g.delay}s`,
              }}
              className={`absolute select-none pointer-events-none font-black ${g.animClass} ${g.colorClass}`}
            >
              {g.icon}
            </span>
          ) : (
            <span
              key={`glister-${g.id}`}
              style={{
                left: g.left,
                top: g.top,
                width: `${g.size}px`,
                height: `${g.size}px`,
                animationDuration: g.duration,
                animationDelay: `${g.delay}s`,
              }}
              className={`absolute rounded-full select-none pointer-events-none bg-white dark:bg-slate-100 shadow-[0_0_8px_rgba(255,255,255,0.9)] ${g.animClass}`}
            />
          )
        ))}
      </div>

      {/* Randomized Full-Screen Luminescent Meteor Shower (Zero-Lag 60+ FPS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {meteors.map((m) => (
          <span
            key={m.id}
            className={m.animClass}
            style={{
              top: m.top,
              left: m.left,
              width: m.headSize,
              height: m.headSize,
              backgroundColor: m.headBg,
              boxShadow: m.headGlow,
              animationDelay: `${m.delay}s`,
              animationDuration: m.duration,
            }}
          >
            {/* Dynamic Luminescent Trail */}
            <span
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: m.trailWidth,
                height: "1.5px",
                background: m.trailBackground,
                borderRadius: "9999px",
              }}
            />
          </span>
        ))}
      </div>

      {/* Lightweight Floating Gaming Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
            className={`absolute font-black select-none pointer-events-none ${p.animClass} ${p.colorClass}`}
          >
            {p.shape}
          </div>
        ))}
      </div>

      {/* Subtle Digital Grid Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLight ? "opacity-[0.06]" : "opacity-[0.04]"
        }`}
        style={{
          backgroundImage: isLight
            ? `radial-gradient(rgba(15, 23, 42, 0.5) 1.5px, transparent 1.5px)`
            : `radial-gradient(rgba(255, 255, 255, 0.5) 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
}
