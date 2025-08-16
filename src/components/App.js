import { useEffect, useReducer } from "react";
import CategorySelection from "./CategorySelection";
import Error from "./Error";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Question from "./Question";
import ResetButton from "./ResetButton";
import TeamSetup from "./TeamSetup";
import TeamTransition from "./TeamTransition";

const SECS_PER_QUESTION = 20;

const STORAGE_KEY = "quizify:state:v1";

// Only persist what's needed to resume a round
const PERSIST_KEYS = [
  "questions",
  "questionType",
  "status",
  "index",
  "answer",
  "points",
  "secondsRemaining",
  "isTimerPaused",
  "teams",
  "currentTeam",
  "showTransition",
  "categories",
  "currentCategory",
  "completedCategories",
  "totalPoints",
];

function serializeState(state) {
  const out = {};
  for (const k of PERSIST_KEYS) out[k] = state[k];
  return out;
}

const initialState = {
  questions: [],
  questionType: null,
  status: "loading",
  index: 0,
  answer: null,
  points: {},
  secondsRemaining: null,
  isTimerPaused: false,
  teams: [],
  currentTeam: null,
  showTransition: true,
  categories: [],
  currentCategory: null,
  completedCategories: [],
  totalPoints: {},
  _loadedFromStorage: false,
};

function shuffle(array) {
  const a = array.slice(); // don't mutate original
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function reducer(state, action) {
  console.log("Reducer action:", action.type, action.payload);

  try {
    switch (action.type) {
      case "dataReceived": {
        const incomingCats = action.payload.categories || [];
        return {
          ...state,
          // If resuming, keep whatever we had; otherwise use fetched categories
          categories: state.categories?.length
            ? state.categories
            : incomingCats,
          // Only force selectingTeams if we’re truly fresh
          status: state.status === "loading" ? "selectingTeams" : state.status,
          _loadedFromStorage: false, // clear the flag
        };
      }

      case "teamsConfirmed":
        const teams = action.payload || [];
        return {
          ...state,
          teams,
          points: teams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
          totalPoints: teams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
          currentTeam: teams[0] || null,
          status: "selectingCategory",
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
          secondsRemaining: SECS_PER_QUESTION,
          isTimerPaused: false,
        };

      case "tick":
        return {
          ...state,
          secondsRemaining: state.isTimerPaused
            ? state.secondsRemaining
            : Math.max(0, state.secondsRemaining - 1),
          isTimerPaused:
            state.secondsRemaining === 0 ? true : state.isTimerPaused,
        };

      case "toggleTimer":
        return {
          ...state,
          isTimerPaused: !state.isTimerPaused,
        };

      case "setTeams":
        const newTeams = action.payload || [];
        return {
          ...state,
          teams: newTeams,
          points: newTeams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
          currentTeam: newTeams[0] || null,
        };

      case "newAnswer": {
        const question = state.questions[state.index];
        if (!question) return state;

        const isCorrect = action.payload === question.correctOption;
        const currentTeam = state.currentTeam;
        if (!currentTeam) return state;

        return {
          ...state,
          answer: action.payload,
          points: {
            ...state.points,
            [currentTeam]: isCorrect
              ? (state.points[currentTeam] || 0) + (question.points || 0)
              : state.points[currentTeam] || 0,
          },
          isTimerPaused: true,
        };
      }

      case "hideTransition":
        return {
          ...state,
          showTransition: false,
        };

      case "selectCategory": {
        const categoryIndex = action.payload;
        const selectedCategory = state.categories[categoryIndex];
        if (!selectedCategory) return state;
        const shuffled = shuffle(selectedCategory.questions || []);

        return {
          ...state,
          currentCategory: categoryIndex,
          questions: shuffled,
          questionType: selectedCategory.type || null,
          status: "active",
          index: 0,
          answer: null,
          currentTeam: state.teams[0] || null,
          points: Object.fromEntries(state.teams.map((team) => [team, 0])),
          secondsRemaining: SECS_PER_QUESTION,
          showTransition: true,
        };
      }

      case "categoryComplete": {
        // Calculate new total points by adding current category points
        const newTotalPoints = { ...state.totalPoints };
        Object.entries(state.points || {}).forEach(([team, score]) => {
          newTotalPoints[team] = (newTotalPoints[team] || 0) + (score || 0);
        });

        // Check if this was the last category
        const newCompletedCategories = [
          ...state.completedCategories,
          state.currentCategory,
        ];
        const isLastCategory =
          newCompletedCategories.length >= state.categories.length;

        return {
          ...state,
          completedCategories: newCompletedCategories,
          totalPoints: newTotalPoints,
          status: isLastCategory ? "finished" : "selectingCategory",
          currentCategory: isLastCategory ? state.currentCategory : null,
          questions: [],
          index: 0,
          answer: null,
          points: Object.fromEntries(state.teams.map((team) => [team, 0])),
          showTransition: true,
        };
      }

      case "nextQuestion": {
        const isLastQuestion = state.index >= state.questions.length - 1;

        if (isLastQuestion) {
          return {
            ...state,
            status: "finished",
            showTransition: false,
            secondsRemaining: null,
            // keep `points` as-is so the Finish screen can show the category scoreboard
          };
        }

        // Normal advance: rotate team and reset timer
        const currentTeamIndex = state.teams.indexOf(state.currentTeam);
        const nextTeamIndex = (currentTeamIndex + 1) % state.teams.length;

        return {
          ...state,
          index: state.index + 1,
          answer: null,
          currentTeam: state.teams[nextTeamIndex] || state.teams[0],
          secondsRemaining: SECS_PER_QUESTION,
          showTransition: true,
          isTimerPaused: false,
        };
      }

      case "restart": {
        // also clear storage
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
        return {
          ...initialState,
          status: "selectingTeams",
          categories: state.categories, // keep loaded categories
        };
      }

      default:
        console.error("Unknown action type:", action.type);
        return state;
    }
  } catch (error) {
    console.error("Reducer error:", error, "Action:", action);
    return state; // Return current state on error to prevent crashes
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return init;
      const saved = JSON.parse(raw);
      // Merge, but keep "loading" until data arrives; we’ll preserve status in dataReceived
      return { ...init, ...saved, _loadedFromStorage: true };
    } catch {
      return init;
    }
  });

  // Persist after each state change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(serializeState(state))
      );
    } catch (e) {
      console.error("Persist failed", e);
    }
  }, [state]);

  const {
    questions,
    status,
    index,
    answer,
    points,
    secondsRemaining,
    isTimerPaused,
    currentTeam,
    showTransition,
    teams,
    categories,
    currentCategory,
    completedCategories,
    totalPoints,
    questionType,
  } = state;

  const numQuestions = questions?.length || 0;
  const categoryTotalPoints =
    questions?.reduce((prev, cur) => prev + (cur?.points || 0), 0) || 0;

  console.log("App render:", {
    status,
    currentCategory,
    categoriesLength: categories?.length || 0,
    completedCategoriesLength: completedCategories?.length || 0,
    hasCategories: !!categories,
    hasTotalPoints: !!totalPoints,
    teams: teams?.length || 0,
  });

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/questions.json`)
      .then((r) => r.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }));
  }, []);

  return (
    <div className="app">
      <Header />
      {(status === "active" || status === "finished") && (
        <ResetButton dispatch={dispatch} />
      )}

      <Main>
        <div className="main px-4 sm:px-6">
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}

          {status === "selectingTeams" && (
            <TeamSetup
              onConfirm={(teams) =>
                dispatch({ type: "teamsConfirmed", payload: teams })
              }
            />
          )}

          {status === "selectingCategory" && (
            <CategorySelection
              categories={categories || []}
              onSelect={(index) =>
                dispatch({ type: "selectCategory", payload: index })
              }
              completedCategories={completedCategories || []}
            />
          )}

          {status === "active" && (
            <>
              {showTransition ? (
                <TeamTransition
                  team={currentTeam || "Team"}
                  onContinue={() => dispatch({ type: "hideTransition" })}
                />
              ) : (
                <div className="flex flex-col items-center py-2 w-full">
                  <div className="mb-8 text-center w-full">
                    <span className="text-xl lg:text-4xl font-semibold">
                      Current team:{" "}
                      <span className="text-[#6b05fa]">
                        {currentTeam || "Unknown"}
                      </span>
                    </span>
                  </div>

                  <Progress
                    index={index}
                    numQuestions={numQuestions}
                    points={
                      points && currentTeam ? points[currentTeam] || 0 : 0
                    }
                    totalPoints={
                      teams?.length ? categoryTotalPoints / teams.length : 0
                    }
                    answer={answer}
                  />

                  {questions[index] && (
                    <Question
                      questionType={questionType}
                      question={questions[index]}
                      dispatch={dispatch}
                      answer={answer}
                      secPerQuestion={SECS_PER_QUESTION}
                      secondsRemaining={secondsRemaining || 0}
                      isTimerPaused={isTimerPaused}
                    />
                  )}

                  <Footer>
                    <NextButton
                      index={index}
                      numQuestions={numQuestions}
                      dispatch={dispatch}
                      answer={answer}
                    />
                  </Footer>
                </div>
              )}
            </>
          )}

          {status === "finished" && (
            <FinishScreen
              points={points || {}}
              totalPoints={totalPoints || {}}
              categoryTitle={
                currentCategory !== null && categories?.[currentCategory]
                  ? categories[currentCategory].title
                  : "Quiz Complete"
              }
              dispatch={dispatch}
              hasMoreCategories={
                (completedCategories?.length || 0) + 1 <
                (categories?.length || 0)
              }
            />
          )}
        </div>
      </Main>
    </div>
  );
}
