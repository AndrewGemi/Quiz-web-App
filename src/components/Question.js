import Options from "./Options";
import Timer from "./Timer";

function Question({
  question,
  dispatch,
  answer,
  secondsRemaining,
  isTimerPaused,
}) {
  return (
    <section className="question-container card flex flex-col gap-4 anim-scale-in">
      <div className="flex flex-col items-end w-full">
        <Timer
          dispatch={dispatch}
          secondsRemaining={secondsRemaining || 0}
          isTimerPaused={isTimerPaused}
        />
        <h4 className="text-right m-0 anim-fade-up">{question.question}</h4>
      </div>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </section>
  );
}

export default Question;
