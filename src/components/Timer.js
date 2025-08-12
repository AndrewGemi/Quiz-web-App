import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining, isTimerPaused }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsRemaining / 30; // 30 seconds total
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <div className="timer self-center">
      <svg width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#ccc"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#fab005"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy=".3em" fill="yellow">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </text>
      </svg>
      <button
        className={`btn btn-pause hover:scale-75 ${secondsRemaining === 0 ? "pointer-events-none" : ""}`}
        disabled={secondsRemaining === 0}
        onClick={() => dispatch({ type: "toggleTimer" })}
      >
        {secondsRemaining === 0 ? "Time's up!" : !isTimerPaused ? "⏸︎" : "▶︎"}
      </button>
    </div>
  );
}

export default Timer;
