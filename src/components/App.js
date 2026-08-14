import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useReducer, useState } from "react";
import BackgroundCanvas from "./BackgroundCanvas";
import CategorySelection from "./CategorySelection";
import Error from "./Error";
import ExamModeSelection from "./ExamModeSelection";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Loader from "./Loader";
import Logo from "./Logo";
import Main from "./Main";
import NextButton from "./NextButton";
import Question from "./Question";
import ResetButton from "./ResetButton";
import TeamSetup from "./TeamSetup";
import TeamTransition from "./TeamTransition";
import Timer, { FullscreenButton, ThemeToggle } from "./Timer";

/* ============ Exam files & config ============ */
const EXAM_FILES = {
  real: `${process.env.PUBLIC_URL}/data/questions_real.json`,
  trial: `${process.env.PUBLIC_URL}/data/questions_trial.json`,
  shootout: `${process.env.PUBLIC_URL}/data/questions_shootout.json`,
};

const MODE_CONFIG = {
  real: { secsPerQuestion: 20, pointsPerCorrect: "question" },
  trial: { secsPerQuestion: 20, pointsPerCorrect: "question" },
  shootout: { secsPerQuestion: 20, pointsPerCorrect: 1 },
};
const getModeConfig = (mode) => MODE_CONFIG[mode] || MODE_CONFIG.trial;

/* ============ Persistence ============ */
const STORAGE_KEY = "quizify:state:v1";

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
  "examMode",
  "secsPerQuestion",
  "pointsPerCorrect",
];

function serializeState(state) {
  const out = {};
  for (const k of PERSIST_KEYS) out[k] = state[k];
  return out;
}

/* ============ Initial state ============ */
const initialState = {
  questions: [],
  questionType: null,
  status: "selectingExam",
  examMode: null,
  secsPerQuestion: 20,
  pointsPerCorrect: "question",
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

/* ============ Utils ============ */
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============ Reducer ============ */
function reducer(state, action) {
  try {
    switch (action.type) {
      case "dataReceived": {
        const incomingCats = action.payload.categories || [];
        return {
          ...state,
          categories: state.categories?.length
            ? state.categories
            : incomingCats,
          _loadedFromStorage: false,
        };
      }

      case "setExamMode": {
        const mode = action.payload;
        const cfg = getModeConfig(mode);
        return {
          ...state,
          examMode: mode,
          secsPerQuestion: cfg.secsPerQuestion,
          pointsPerCorrect: cfg.pointsPerCorrect,
          status: "selectingTeams",
          questions: [],
          index: 0,
          answer: null,
          points: Object.fromEntries((state.teams || []).map((t) => [t, 0])),
          secondsRemaining: null,
          isTimerPaused: false,
          currentCategory: null,
        };
      }

      case "teamsConfirmed": {
        const teams = action.payload || [];
        return {
          ...state,
          teams,
          points: teams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
          totalPoints: teams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
          currentTeam: teams[0] || null,
          status: "selectingCategory",
        };
      }

      case "dataFailed":
        return { ...state, status: "error" };

      case "start":
        return {
          ...state,
          status: "active",
          secondsRemaining: state.secsPerQuestion,
          showTransition: true,
          isTimerPaused: true,
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
        return { ...state, isTimerPaused: !state.isTimerPaused };

      case "setTeams": {
        const newTeams = action.payload || [];
        return {
          ...state,
          teams: newTeams,
          points: newTeams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}),
          currentTeam: newTeams[0] || null,
        };
      }

      case "newAnswer": {
        const question = state.questions[state.index];
        if (!question) return state;

        const isCorrect = action.payload === question.correctOption;
        const currentTeam = state.currentTeam;
        if (!currentTeam) return state;

        const pointsToAdd = isCorrect
          ? typeof state.pointsPerCorrect === "number"
            ? state.pointsPerCorrect
            : question.points || 0
          : 0;

        return {
          ...state,
          answer: action.payload,
          points: {
            ...state.points,
            [currentTeam]: (state.points[currentTeam] || 0) + pointsToAdd,
          },
          isTimerPaused: true,
        };
      }

      case "hideTransition":
        return {
          ...state,
          showTransition: false,
          isTimerPaused: false,
          secondsRemaining: state.secsPerQuestion,
        };

      case "selectCategory": {
        const categoryIndex = action.payload;
        const selectedCategory = state.categories[categoryIndex];
        if (!selectedCategory) return state;
        let shuffled = selectedCategory.questions || [];
        if (selectedCategory.randomize) {
          shuffled = shuffle(selectedCategory.questions || []);
        }

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
          secondsRemaining: state.secsPerQuestion,
          showTransition: true,
          isTimerPaused: true,
        };
      }

      case "categoryComplete": {
        const newTotalPoints = { ...state.totalPoints };
        Object.entries(state.points || {}).forEach(([team, score]) => {
          newTotalPoints[team] = (newTotalPoints[team] || 0) + (score || 0);
        });

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
          };
        }

        const teamCount = state.teams.length;
        const currentIdx = state.teams.indexOf(state.currentTeam);
        const nextTeamIndex = (currentIdx + 1) % teamCount;
        const endOfRound = state.examMode === "shootout" && nextTeamIndex === 0;

        let nextTeams = state.teams;
        let nextPoints = state.points;
        let nextCurrentTeam;

        if (endOfRound) {
          const scores = state.teams.map((t) => ({
            team: t,
            score: state.points[t] || 0,
          }));
          const values = scores.map((s) => s.score);
          const min = Math.min(...values);
          const max = Math.max(...values);

          if (max !== min) {
            const survivors = scores
              .filter((s) => s.score > min)
              .map((s) => s.team);

            if (survivors.length >= 2) {
              nextTeams = survivors;
              nextPoints = survivors.reduce((acc, t) => {
                acc[t] = state.points[t] || 0;
                return acc;
              }, {});
              nextCurrentTeam = survivors[0];
            } else {
              const winner =
                scores.find((s) => s.score === max)?.team || state.currentTeam;
              return {
                ...state,
                status: "finished",
                showTransition: false,
                secondsRemaining: null,
                currentTeam: winner,
              };
            }
          } else {
            nextCurrentTeam = state.teams[0];
          }
        } else {
          nextCurrentTeam = state.teams[nextTeamIndex];
        }

        return {
          ...state,
          index: state.index + 1,
          answer: null,
          teams: nextTeams,
          points: nextPoints,
          currentTeam: nextCurrentTeam,
          secondsRemaining: state.secsPerQuestion,
          showTransition: true,
          isTimerPaused: true,
        };
      }

      case "startPenaltyShootout": {
        const tiedTeams = action.payload || [];
        const cfg = getModeConfig("shootout");
        return {
          ...state,
          examMode: "shootout",
          secsPerQuestion: cfg.secsPerQuestion,
          pointsPerCorrect: cfg.pointsPerCorrect,
          status: "selectingCategory",
          teams: tiedTeams,
          currentTeam: tiedTeams[0] || null,
          points: tiedTeams.reduce((acc, t) => ({ ...acc, [t]: 0 }), {}),
          totalPoints: tiedTeams.reduce((acc, t) => ({ ...acc, [t]: 0 }), {}),
          questions: [],
          index: 0,
          answer: null,
          categories: [],
          completedCategories: [],
          _loadedFromStorage: false,
        };
      }

      case "restart": {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch { }
        return {
          ...initialState,
          status: "selectingExam",
          examMode: null,
          categories: [],
        };
      }

      default:
        console.error("Unknown action type:", action.type);
        return state;
    }
  } catch (error) {
    console.error("Reducer error:", error, "Action:", action);
    return state;
  }
}

/* ============ App component ============ */
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("quizify_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    try {
      localStorage.setItem("quizify_theme", theme);
    } catch { }
  }, [theme]);

  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return init;
      const saved = JSON.parse(raw);
      return { ...init, ...saved, _loadedFromStorage: true };
    } catch {
      return init;
    }
  });

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

  useEffect(() => {
    if (state._loadedFromStorage && state.categories?.length) return;
    if (!state.examMode) return;

    const url = EXAM_FILES[state.examMode] || EXAM_FILES.real;
    let cancelled = false;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch(() => !cancelled && dispatch({ type: "dataFailed" }));

    return () => {
      cancelled = true;
    };
  }, [state.examMode, state._loadedFromStorage]);

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
    secsPerQuestion,
  } = state;

  const numQuestions = questions?.length || 0;
  const categoryTotalPoints =
    questions?.reduce((prev, cur) => prev + (cur?.points || 0), 0) || 0;

  return (
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100 relative">
      <BackgroundCanvas theme={theme} />
      {/* Floating Logo in Top Left */}
      <div className="fixed top-4 left-4 sm:left-6 z-40 glass-card px-4 py-2 border-purple-200/90 dark:border-purple-500/30 backdrop-blur-xl bg-white/95 dark:bg-[#120826]/90 rounded-2xl shadow-md dark:shadow-xl">
        <Logo />
      </div>

      {/* Floating Controls in Top Right */}
      <div className="fixed top-4 right-4 sm:right-6 z-40 flex items-center gap-2.5">
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        />
        {status === "active" ? (
          <Timer
            dispatch={dispatch}
            secondsRemaining={secondsRemaining || 0}
            isTimerPaused={isTimerPaused}
            secPerQuestion={secsPerQuestion}
          />
        ) : (
          <FullscreenButton />
        )}
      </div>

      {status !== "selectingExam" && <ResetButton dispatch={dispatch} />}

      <Main>
        <div className="w-full relative z-10 overflow-hidden min-h-[60vh] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Loader />
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Error />
              </motion.div>
            )}

            {status === "selectingExam" && (
              <motion.div
                key="selectingExam"
                initial={{ opacity: 0, y: 25, scale: 0.96, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -25, scale: 0.96, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <ExamModeSelection
                  onPick={(mode) =>
                    dispatch({ type: "setExamMode", payload: mode })
                  }
                />
              </motion.div>
            )}

            {status === "selectingTeams" && (
              <motion.div
                key="selectingTeams"
                initial={{ opacity: 0, y: 25, scale: 0.96, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -25, scale: 0.96, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <TeamSetup
                  onConfirm={(teams) =>
                    dispatch({ type: "teamsConfirmed", payload: teams })
                  }
                />
              </motion.div>
            )}

            {status === "selectingCategory" && (
              <motion.div
                key="selectingCategory"
                initial={{ opacity: 0, y: 25, scale: 0.96, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -25, scale: 0.96, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <CategorySelection
                  categories={categories || []}
                  onSelect={(i) => dispatch({ type: "selectCategory", payload: i })}
                  completedCategories={completedCategories || []}
                />
              </motion.div>
            )}

            {status === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                <AnimatePresence mode="wait">
                  {showTransition ? (
                    <TeamTransition
                      key="team-transition"
                      team={currentTeam || "Team"}
                      teams={teams || []}
                      points={points || {}}
                      totalPoints={totalPoints || {}}
                      index={index}
                      numQuestions={numQuestions}
                      onContinue={() => dispatch({ type: "hideTransition" })}
                    />
                  ) : (
                    <motion.div
                      key={`question-view-${index}`}
                      initial={{ opacity: 0, y: 25, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -25, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-col items-center w-full"
                    >
                      {/* Prominent Active Team Turn Banner */}
                      <div className="mb-4 text-center w-full max-w-7xl mx-auto">
                        <div className="inline-flex items-center gap-3.5 px-6 py-2.5 rounded-2xl glass-card border-2 border-purple-200/90 dark:border-purple-500/40 shadow-lg dark:shadow-xl backdrop-blur-xl bg-white/95 dark:bg-card">
                          <span className="text-2xl sm:text-3xl animate-pulse">
                            {teams?.[currentTeam]?.avatar || "🎯"}
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-800 dark:text-purple-300">
                              Current Turn to Answer
                            </span>
                            <span dir="auto" className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                              {teams?.[currentTeam]?.name || currentTeam || "Team"}
                            </span>
                          </div>
                          <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-black text-xs sm:text-sm border border-amber-300 dark:border-amber-400/30 ml-2 shadow-sm">
                            ⭐ {points && currentTeam ? points[currentTeam] || 0 : 0} pts
                          </span>
                        </div>
                      </div>

                      {questions[index] && (
                        <Question
                          questionType={questionType}
                          question={questions[index]}
                          dispatch={dispatch}
                          answer={answer}
                          secPerQuestion={secsPerQuestion}
                          secondsRemaining={secondsRemaining || 0}
                          isTimerPaused={isTimerPaused}
                        />
                      )}

                      <Footer>
                        <NextButton
                          dispatch={dispatch}
                          answer={answer}
                          index={index}
                          numQuestions={numQuestions}
                        />
                      </Footer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {status === "finished" && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.94 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <FinishScreen
                  points={points || {}}
                  totalPoints={totalPoints || {}}
                  teams={teams || []}
                  dispatch={dispatch}
                  categories={categories || []}
                  completedCategories={completedCategories || []}
                  currentCategory={currentCategory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Main>
    </div>
  );
}
