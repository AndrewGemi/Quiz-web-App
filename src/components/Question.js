import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Options from "./Options";

/* Split an answer string into parts for blanks. */
function splitAnswerParts(s) {
  if (!s) return [];
  return String(s)
    .split(/\/|,|،|–|—|-|;|\||\n/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

/* Collapse various shapes into an answers array */
function useAnswers(question) {
  return useMemo(() => {
    if (
      Array.isArray(question.acceptableAnswers) &&
      question.acceptableAnswers.length
    ) {
      return question.acceptableAnswers.map(String);
    }
    if (Array.isArray(question.answers) && question.answers.length) {
      return question.answers.map(String);
    }
    if (typeof question.answer === "string" && question.answer.trim()) {
      return splitAnswerParts(question.answer.trim());
    }
    return [];
  }, [question]);
}

/* Build React nodes: replace each placeholder with <mark>answer</mark> */
function fillWithAnswersNodes(text, parts) {
  const PLACEHOLDER_RE = /(\.{2,}|…+|_+|ـ{2,})/gu;

  const nodes = [];
  let last = 0;
  let idx = 0;

  text.replace(PLACEHOLDER_RE, (_match, _g1, offset) => {
    if (last < offset) nodes.push(text.slice(last, offset));

    const val = parts[idx++] ?? "—";

    nodes.push(
      <mark
        key={`ans-${offset}-${idx}`}
        dir="auto"
        title={val}
        className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-green-600 dark:text-green-500 font-black border border-emerald-300 dark:border-emerald-500/40 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.35)] mx-1 inline-block"
      >
        {val}
      </mark>
    );

    last = offset + _match.length;
    return _match;
  });

  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length ? nodes : [text];
}

/* Fill-in-the-blank reveal card */
function CompleteReveal({ question, dispatch }) {
  const [revealed, setRevealed] = useState(false);
  const [locked, setLocked] = useState(false);

  const parts = useAnswers(question);
  const fullAnswer = parts.join(" / ") || "—";
  const points = typeof question.points === "number" ? question.points : 10;

  const correctIndex =
    typeof question.correctOption === "number" ? question.correctOption : 0;
  const wrongIndex =
    Array.isArray(question.options) && question.options.length > 1
      ? (correctIndex + 1) % question.options.length
      : correctIndex === 0
        ? 1
        : 0;

  const titleNodes = revealed
    ? fillWithAnswersNodes(question.question || "", parts)
    : [question.question];

  function handleCorrect() {
    if (!revealed || locked) return;
    setLocked(true);
    dispatch({ type: "newAnswer", payload: correctIndex });
  }
  function handleSkip() {
    if (!revealed || locked) return;
    setLocked(true);
    dispatch({ type: "newAnswer", payload: wrongIndex });
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full rounded-2xl p-4 sm:p-6 glass-card border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-card shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_25px_rgba(0,0,0,0.3)] relative overflow-hidden text-justify flex flex-col items-center justify-center min-h-[110px] gap-3"
      >
        <div className="absolute -top-20 inset-x-0 h-28 bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl pointer-events-none rounded-full" />
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-emerald-200 dark:text-emerald-300 bg-emerald-800 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 mb-2 shadow-sm">
          <span>✏️</span>
          <span>Fill in the Blank</span>
        </div>
        <p
          className=" text-2xl sm:text-4xl lg:text-5xl font-black leading-relaxed sm:leading-loose text-justify text-slate-950 dark:text-white relative z-10 max-w-5xl w-full"
          dir="auto"
        >
          {titleNodes}
        </p>
      </motion.div>

      {!revealed ? (
        <button
          type="button"
          className="btn-primary self-end text-xl sm:text-2xl px-10 py-5 rounded-2xl shadow-xl"
          onClick={() => setRevealed(true)}
        >
          👁 Show Answer
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 w-full"
        >
          <div className="rounded-3xl p-6 bg-emerald-50/90 dark:bg-white/5 border border-emerald-300 dark:border-emerald-500/30 flex flex-col gap-2 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <span className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-500">
              Verified Correct Answer
            </span>
            <div dir="auto" className="text-3xl sm:text-6xl font-black text-green-600 dark:text-green-500 break-words">
              {fullAnswer}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              className="btn-primary btn-emerald text-xl px-10 py-5"
              onClick={handleCorrect}
              disabled={locked}
            >
              ✓ Award Points (+{points})
            </button>
            <button
              type="button"
              className="btn-secondary text-xl px-8 py-5"
              onClick={handleSkip}
              disabled={locked}
            >
              ✕ Skip Question (0 pts)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Question({
  question,
  dispatch = () => { },
  answer,
}) {
  const isMCQ = Array.isArray(question?.options) && question.options.length > 0;
  const points = typeof question.points === "number" ? question.points : 10;

  // Keyboard shortcut listener for MCQ answers (1-4 or A-D)
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isMCQ || answer !== null) return;
      const key = e.key.toUpperCase();
      let selectedIdx = null;

      if (key === "1" || key === "A") selectedIdx = 0;
      else if (key === "2" || key === "B") selectedIdx = 1;
      else if (key === "3" || key === "C") selectedIdx = 2;
      else if (key === "4" || key === "D") selectedIdx = 3;

      if (selectedIdx !== null && selectedIdx < (question.options?.length || 0)) {
        dispatch({ type: "newAnswer", payload: selectedIdx });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMCQ, answer, question.options, dispatch]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto glass-card border-2 border-purple-200/90 dark:border-purple-500/40 p-8 sm:p-10 flex flex-col gap-6 shadow-2xl rounded-3xl backdrop-blur-xl bg-white/95 dark:bg-[#120826]/95 relative"
    >
      {/* Question Header Badge Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-purple-200 dark:border-purple-500/25">
        <div className="flex items-center gap-2.5">
          {/* <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/30 shadow-sm">
            🎮 {isMCQ ? "Multiple Choice" : "Fill in the Blank"}
          </span> */}
          <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-amber-950 dark:text-amber-600 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/30 shadow-sm">
            Question points: ⭐ {points} pts
          </span>
        </div>
      </div>

      {/* Question Content inside Wayground Stage Box */}
      {isMCQ ? (
        <div className="flex flex-col gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-2xl p-8 sm:p-12 glass-card border border-purple-200 dark:border-purple-400/35 bg-slate-50/80 dark:bg-[#0f131d]/70 shadow-sm dark:shadow-xl text-center flex flex-col items-center justify-center min-h-[180px] sm:min-h-[220px]"
          >
            <h2 dir="auto" className="text-3xl sm:text-5xl lg:text-6xl font-black leading-snug sm:leading-relaxed text-slate-950 dark:text-white text-justify break-words max-w-5xl w-full">
              {question.question}
            </h2>
          </motion.div>
          <Options question={question} dispatch={dispatch} answer={answer} />
        </div>
      ) : (
        <CompleteReveal question={question} dispatch={dispatch} />
      )}
    </motion.section>
  );
}
