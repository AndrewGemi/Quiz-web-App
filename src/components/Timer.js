import { useCallback, useEffect, useRef, useState } from "react";

function Timer({ dispatch, secondsRemaining, isTimerPaused }) {
  const [isMuted, setIsMuted] = useState(false);
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const total = 20; // total seconds per question
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, secondsRemaining) / total;
  const strokeDashoffset = circumference * (1 - progress);

  // --- AUDIO SETUP ---
  const beepRef = useRef(null);
  const timesUpRef = useRef(null);
  const prevSecRef = useRef(secondsRemaining);
  const playTokenRef = useRef(0);

  // preload sounds once (after any user gesture on the page, browsers will allow playback)
  useEffect(() => {
    beepRef.current = new Audio(
      `${process.env.PUBLIC_URL || ""}/sounds/beep.mp3`
    );
    timesUpRef.current = new Audio(
      `${process.env.PUBLIC_URL || ""}/sounds/timesup.mp3`
    );

    // mobile-friendly hints
    [beepRef.current, timesUpRef.current].forEach((a) => {
      if (!a) return;
      a.preload = "auto";
      a.crossOrigin = "anonymous";
      a.playsInline = true;
      a.loop = false;
      a.volume = 0.6; // tweak as you like
    });

    return () => {
      // clean up to avoid memory leaks on unmount
      [beepRef.current, timesUpRef.current].forEach((a) => {
        if (!a) return;
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const stopAllAudio = useCallback(() => {
    playTokenRef.current++; // invalidate in-flight play() promises

    [beepRef.current, timesUpRef.current].forEach((a) => {
      if (!a) return;
      a.pause();
      try {
        a.currentTime = 0;
      } catch {}
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    if (isTimerPaused) stopAllAudio();
  }, [isTimerPaused, stopAllAudio]);

  // play sounds when the displayed second changes
  useEffect(() => {
    const prev = prevSecRef.current;
    prevSecRef.current = secondsRemaining;

    if (prev === secondsRemaining) return; // no change
    if (isTimerPaused) return; // don't beep while paused

    if (secondsRemaining < 0) return; // safety

    // last 3…2…1 beeps
    if (secondsRemaining > 0 && secondsRemaining <= 5) {
      const token = ++playTokenRef.current;
      const a = beepRef.current;
      if (a) {
        a.currentTime = 0;
        a.play()
          .then(() => {
            // if paused or a newer play started, stop this one
            if (token !== playTokenRef.current || isTimerPaused) a.pause();
          })
          .catch(() => {});
      }
    }

    // time's up
    if (secondsRemaining === 0) {
      if (beepRef.current) beepRef.current.pause();
      if (timesUpRef.current) {
        timesUpRef.current.currentTime = 0;
        timesUpRef.current.play().catch(() => {});
      }
    }
  }, [secondsRemaining, isTimerPaused]);

  const lowTime = secondsRemaining <= 10 && secondsRemaining > 0;

  const label =
    secondsRemaining === 0 ? "Time's up!" : isTimerPaused ? "Resume" : "Pause";

  return (
    <div
      className={`flex self-center mb-5 anim-fade-in ${
        lowTime ? "anim-pulse" : ""
      }`}
      style={{ gap: 8, padding: 8, borderRadius: 14 }}
      aria-live="polite"
    >
      <svg width="100" height="100" role="img" aria-label="Question timer">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#2a2f3c"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#fab005"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy=".35em"
          fill="#ffd43b"
          style={{ fontSize: "1.8rem", fontWeight: 700 }}
        >
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </text>
      </svg>
      <div className="min-w-20 aspect-square overflow-hidden flex items-center self-center">
        <div>
          <button
            className="btn btn-pause active:scale-95"
            disabled={secondsRemaining === 0}
            onClick={() => dispatch({ type: "toggleTimer" })}
            aria-label={label}
          >
            {secondsRemaining === 0 ? "⏱" : isTimerPaused ? "▶︎" : "⏸︎"}
          </button>
        </div>
        <div>
          <button
            className="btn active:scale-95"
            onClick={() => {
              setIsMuted((prev) => !prev);
              const muted = !(beepRef.current?.muted || false);
              if (beepRef.current) beepRef.current.muted = muted;
              if (timesUpRef.current) timesUpRef.current.muted = muted;
            }}
            aria-label="Toggle sound"
            style={{ minWidth: 60, marginLeft: 6, borderRadius: 14 }}
          >
            {isMuted ? "🔇" : "🔈"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Timer;
