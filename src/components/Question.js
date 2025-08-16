import { useMemo, useState } from "react";
import Options from "./Options";
import Timer from "./Timer";

/* Split an answer string into parts for blanks.
   Supports "/", "," and Arabic "،" as separators. */
function splitAnswerParts(s) {
  if (!s) return [];
  return String(s)
    .split(/\/|,|،/g)
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

/* Build React nodes: replace each placeholder (..., …, or ____ ) with <mark>answer</mark> */
function fillWithAnswersNodes(text, parts) {
  // Matches: 3+ dots, 1+ ellipsis chars, 3+ underscores, or 3+ Tatweel (ـ)
  const PLACEHOLDER_RE = /(\.{3,}|…+|_+|ـ{3,})/gu;

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
        className="px-1 rounded bg-teal-400/20 text-teal-300 font-bold ring-1 ring-teal-500/30"
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

/* “Complete” flow: Show Answer -> Add Score / Skip */
function CompleteReveal({ question, dispatch }) {
  const [revealed, setRevealed] = useState(false);
  const [locked, setLocked] = useState(false);

  const parts = useAnswers(question); // pieces that fill the blanks
  const fullAnswer = parts.join(" / ") || "—";
  const points = typeof question.points === "number" ? question.points : 10;

  // Your reducer scores by index. For “complete”, use index 0 as the correct slot.
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
    <div className="flex flex-col gap-4 anim-fade-up">
      {/* Question text with inline blanks; fills after reveal */}
      <h4
        className="m-0 text-right text-[1.2rem] sm:text-[1.4rem] lg:text-3xl leading-normal break-words"
        dir="auto"
      >
        {titleNodes}
      </h4>

      {!revealed ? (
        <button
          type="button"
          className="btn w-full sm:w-auto self-end active:scale-95"
          onClick={() => setRevealed(true)}
          aria-label="Show Answer"
          style={{ borderRadius: 14, padding: "12px 16px" }}
        >
          Show Answer
        </button>
      ) : (
        <>
          {/* Also show the full answer plainly for clarity/accessibility */}
          <div className="rounded-lg p-4 bg-[rgba(255,255,255,0.04)] flex flex-col gap-3">
            <div className="text-sm lg:text-xl text-gray-400">
              Correct answer
            </div>
            <div className="text-lg sm:text-xl lg:text-3xl font-semibold break-words">
              {fullAnswer}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button
              type="button"
              className="btn w-full sm:w-auto active:scale-95"
              onClick={handleCorrect}
              disabled={locked}
              style={{
                borderRadius: 14,
                padding: "12px 16px",
                fontWeight: 700,
                background: "linear-gradient(90deg,#10b981,#059669)",
              }}
            >
              Add Score (+{points})
            </button>
            <button
              type="button"
              className="btn w-full sm:w-auto active:scale-95"
              onClick={handleSkip}
              disabled={locked}
              style={{
                borderRadius: 14,
                padding: "12px 16px",
                fontWeight: 700,
                background: "linear-gradient(90deg,#6b7280,#4b5563)",
              }}
            >
              Skip (0)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Question({
  question,
  dispatch,
  answer,
  secondsRemaining,
  isTimerPaused,
  secPerQuestion,
}) {
  const isMCQ = Array.isArray(question?.options) && question.options.length > 0;

  return (
    <section className="question-container card flex flex-col gap-4 anim-scale-in">
      {/* Timer row */}

      <Timer
        dispatch={dispatch}
        secondsRemaining={secondsRemaining || 0}
        isTimerPaused={isTimerPaused}
        secPerQuestion={secPerQuestion}
      />

      {isMCQ ? (
        <>
          <h4 className="text-right text-[1.4rem] sm:text-[1.6rem] lg:text-3xl leading-normal ">
            {question.question}
          </h4>
          <Options question={question} dispatch={dispatch} answer={answer} />
        </>
      ) : (
        <CompleteReveal question={question} dispatch={dispatch} />
      )}
    </section>
  );
}
