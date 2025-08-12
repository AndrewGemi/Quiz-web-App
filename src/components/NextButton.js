function NextButton({ index, numQuestions, dispatch, answer }) {
  if (answer === null) return null;

  const isLast = index >= numQuestions - 1;

  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "nextQuestion" })}
    >
      {isLast ? "Finish" : "Next"}
    </button>
  );
}

export default NextButton;
