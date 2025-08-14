function TeamTransition({ team, onContinue }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center anim-fade-in"
      style={{
        background: "rgba(0,0,0,.55)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="w-[92%] max-w-[520px] card text-center anim-scale-in"
        style={{
          background: "linear-gradient(135deg,#141a28,#1b1230)",
          border: "1px solid #232836",
          borderRadius: 18,
          padding: 20,
        }}
      >
        <h2 className="text-[clamp(2.2rem,6vw,3.2rem)] font-bold text-white mb-2">
          Next Up:
        </h2>
        <div className="text-[clamp(3rem,10vw,5rem)] font-extrabold text-[color:var(--color-theme)] mb-4">
          {team}
        </div>
        <button
          onClick={onContinue}
          className="btn w-full sm:w-auto active:scale-95"
          style={{
            background: "linear-gradient(90deg,#7c3aed,#5b21b6)",
            borderRadius: 999,
            padding: "12px 20px",
            fontSize: "1.8rem",
            fontWeight: 800,
          }}
          aria-label="Ready to Play"
        >
          Ready to Play
        </button>
      </div>
    </div>
  );
}

export default TeamTransition;
