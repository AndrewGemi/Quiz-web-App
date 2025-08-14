function Logo() {
  return (
    <div className="logo flex items-center gap-2">
      <svg
        className="w-10 h-10 sm:w-16 sm:h-16"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="18" fill="#6b05fa" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="white"
        >
          Q
        </text>
      </svg>
      <h1 className="font-bold text-[clamp(1.6rem,4vw,2.2rem)] leading-none">
        Quizify
      </h1>
    </div>
  );
}

export default Logo;
