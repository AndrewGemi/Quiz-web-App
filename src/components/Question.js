import Options from "./Options";

function Question({ question, dispatch, answer }) {
  return (
    <div className="">
      <h4 className="text-right" >{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
