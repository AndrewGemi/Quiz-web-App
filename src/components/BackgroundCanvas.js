import React from "react";

export default function BackgroundCanvas({ theme = "dark" }) {
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500">
      {/* Base background gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isLight
            ? "bg-[#f8fafc] bg-gradient-to-b from-[#f8fafc] via-[#f5f3ff] to-[#eff6ff]"
            : "bg-[#0f0721] bg-gradient-to-b from-[#180a33] via-[#100624] to-[#080214]"
        }`}
      />

      {/* Floating Glowing Ambient Orb 1 */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full blur-[130px] transition-opacity duration-500 ${
          isLight ? "opacity-40" : "opacity-45"
        }`}
        style={{
          background: isLight
            ? "radial-gradient(circle, #c084fc 0%, rgba(192,132,252,0) 70%)"
            : "radial-gradient(circle, #8b5cf6 0%, rgba(139,92,246,0) 70%)",
          animation: "orb-float-1 22s ease-in-out infinite",
        }}
      />

      {/* Floating Glowing Ambient Orb 2 */}
      <div
        className={`absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] transition-opacity duration-500 ${
          isLight ? "opacity-30" : "opacity-40"
        }`}
        style={{
          background: isLight
            ? "radial-gradient(circle, #38bdf8 0%, rgba(56,189,248,0) 70%)"
            : "radial-gradient(circle, #1368ce 0%, rgba(19,104,206,0) 70%)",
          animation: "orb-float-2 26s ease-in-out infinite",
        }}
      />

      {/* Floating Glowing Ambient Orb 3 */}
      <div
        className={`absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-500 ${
          isLight ? "opacity-25" : "opacity-35"
        }`}
        style={{
          background: isLight
            ? "radial-gradient(circle, #f472b6 0%, rgba(244,114,182,0) 70%)"
            : "radial-gradient(circle, #e21b3c 0%, rgba(226,27,60,0) 70%)",
          animation: "orb-float-3 28s ease-in-out infinite",
        }}
      />

      {/* Subtle Digital Grid Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? "opacity-[0.05]" : "opacity-[0.03]"
        }`}
        style={{
          backgroundImage: isLight
            ? `radial-gradient(rgba(15, 23, 42, 0.4) 1px, transparent 1px)`
            : `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
