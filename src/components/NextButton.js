function NextButton({ index, numQuestions, dispatch, answer }) {
  if (answer === null) return null;

  const isLast = index >= numQuestions - 1;

  return (
    <button
      className="btn w-full sm:w-auto active:scale-95"
      onClick={() => dispatch({ type: "nextQuestion" })}
      style={{
        borderRadius: 14,
        padding: "14px 18px",
        fontSize: "1.7rem",
        fontWeight: 700,
        background: isLast
          ? "linear-gradient(90deg,#10b981,#059669)"
          : "linear-gradient(90deg,#7c3aed,#5b21b6)",
      }}
      aria-label={isLast ? "Finish" : "Next"}
    >
      {isLast ? "Finish" : "Next"}
    </button>
  );
}

export default NextButton;
