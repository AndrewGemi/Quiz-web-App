function Logo() {
  return (
    <div className="logo sm:text-sm">
      <svg width="50" height="50" viewBox="0 0 40 40">
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
      <h1 className="sm:text-sm">Quizify</h1>
    </div>
  );
}

export default Logo;
