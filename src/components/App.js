import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import TeamSetup from "./TeamSetup";
import TeamTransition from "./TeamTransition";
import ResetButton from "./ResetButton";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  // 'loading' , 'error' , 'ready' , 'active' ,'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: {},  // Changed to object to store points per team
  secondsRemaining: null,
  isTimerPaused: false,
  teams: [],
  currentTeam: null,
  showTransition: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        highScore: 0,
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: SECS_PER_QUESTION, // Change this line to start with 30 seconds
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.isTimerPaused
          ? state.secondsRemaining
          : Math.max(0, state.secondsRemaining - 1),
        answer: state.secondsRemaining <= 1
          ? state.questions[state.index].correctOption
          : state.answer
      };

    case "toggleTimer":
      return {
        ...state,
        isTimerPaused: !state.isTimerPaused,
      };

    case "setTeams":
      return {
        ...state,
        teams: action.payload,
        points: action.payload.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
        currentTeam: action.payload[0]
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        isTimerPaused: true,
        points: {
          ...state.points,
          [state.currentTeam]:
            action.payload === question.correctOption && state.secondsRemaining > 0
              ? state.points[state.currentTeam] + question.points
              : state.points[state.currentTeam]
        }
      };

    case "hideTransition":
      return {
        ...state,
        showTransition: false,
      };

    case "nextQuestion":
      const nextTeamIndex = (state.teams.indexOf(state.currentTeam) + 1) % state.teams.length;
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        secondsRemaining: SECS_PER_QUESTION,
        currentTeam: state.teams[nextTeamIndex],
        showTransition: true,
        isTimerPaused: false,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready"
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining, isTimerPaused, currentTeam, showTransition, teams },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      {(status === 'active' || status === 'finished') && (
        <ResetButton dispatch={dispatch} />
      )}
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <TeamSetup dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            {showTransition ? (
              <TeamTransition
                team={currentTeam}
                onContinue={() => dispatch({ type: "hideTransition" })}
              />
            ) : (
              <>
                <div className="text-center text-4xl text-gray-200 mb-6">
                  Current Team: <p className="font-bold text-[#6b05fa]">{currentTeam}</p>
                </div>
                <Progress
                  index={index}
                  numQuestions={numQuestions}
                  points={points[currentTeam]}
                  totalPoints={totalPoints / teams.length}
                  answer={answer}
                />
                <div className="flex flex-col">
                  <Timer
                    dispatch={dispatch}
                    secondsRemaining={secondsRemaining}
                    isTimerPaused={isTimerPaused}
                  />
                </div>

                <Question
                  question={questions[index]}
                  dispatch={dispatch}
                  answer={answer}
                />
                <Footer>
                  <NextButton
                    index={index}
                    numQuestions={numQuestions}
                    dispatch={dispatch}
                    answer={answer}
                  />
                </Footer>
              </>
            )}
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

