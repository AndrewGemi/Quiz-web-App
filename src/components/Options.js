import { motion } from "framer-motion";

const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const WAYGROUND_THEMES = [
  {
    symbol: "▲",
    letter: "A",
    bg: "bg-[#e21b3c] hover:bg-[#c61533] text-white border-b-4 border-[#a00e26] shadow-[0_6px_20px_rgba(226,27,60,0.35)]",
    badge: "bg-white/20 text-white border-white/30",
  },
  {
    symbol: "◆",
    letter: "B",
    bg: "bg-[#1368ce] hover:bg-[#0f53a6] text-white border-b-4 border-[#0b3c78] shadow-[0_6px_20px_rgba(19,104,206,0.35)]",
    badge: "bg-white/20 text-white border-white/30",
  },
  {
    symbol: "●",
    letter: "C",
    bg: "bg-[#ffa602] hover:bg-[#d98d00] text-slate-950 border-b-4 border-[#b37400] shadow-[0_6px_20px_rgba(255,166,2,0.35)] font-black",
    badge: "bg-black/15 text-slate-950 border-black/20",
  },
  {
    symbol: "■",
    letter: "D",
    bg: "bg-[#26890c] hover:bg-[#1d6b09] text-white border-b-4 border-[#154d06] shadow-[0_6px_20px_rgba(38,137,12,0.35)]",
    badge: "bg-white/20 text-white border-white/30",
  },
];

function Options({ question, dispatch = () => {}, answer }) {
  const hasAnswered = answer !== null;

  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full my-3"
    >
      {question.options.map((option, i) => {
        const isSelected = answer === i;
        const isCorrect = i === question.correctOption;
        const theme = WAYGROUND_THEMES[i % WAYGROUND_THEMES.length];

        let optionStyle = theme.bg;

        if (hasAnswered) {
          if (isCorrect) {
            optionStyle =
              "bg-[#10b981] border-b-4 border-[#047857] text-white shadow-[0_0_30px_rgba(16,185,129,0.7)] font-black scale-[1.02] z-10";
          } else if (isSelected && !isCorrect) {
            optionStyle =
              "bg-[#f43f5e] border-b-4 border-[#be123c] text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] opacity-90 font-bold";
          } else {
            optionStyle =
              "opacity-35 grayscale filter cursor-not-allowed border-b-2 border-transparent bg-slate-200/90 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400";
          }
        }

        return (
          <motion.button
            key={`${i}-${option}`}
            variants={item}
            whileHover={hasAnswered ? {} : { scale: 1.02, y: -2 }}
            whileTap={hasAnswered ? {} : { scale: 0.97, y: 2 }}
            disabled={hasAnswered}
            className={`w-full p-4 sm:p-5 rounded-2xl text-right text-lg sm:text-xl font-extrabold transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer select-none ${optionStyle}`}
            onClick={() => dispatch({ type: "newAnswer", payload: i })}
            aria-pressed={isSelected}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-black shrink-0 shadow-sm ${theme.badge}`}>
                {theme.symbol}
              </span>
              <span dir="auto" className="line-clamp-2 leading-snug">
                {option}
              </span>
            </div>

            {hasAnswered && (
              <span className="text-2xl shrink-0 font-black">
                {isCorrect ? "✓" : isSelected ? "✕" : ""}
              </span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default Options;
