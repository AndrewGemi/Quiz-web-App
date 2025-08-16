import { motion } from "framer-motion";

const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="options"
    >
      {question.options.map((option, i) => {
        const isSelected = answer === i;
        const isCorrect = i === question.correctOption;

        // Only mark the selected one as correct/wrong; dim the rest
        const className = [
          "btn",
          "btn-option",
          hasAnswered && isCorrect ? "correct" : "",
          hasAnswered && isSelected && !isCorrect ? "wrong" : "",
          hasAnswered && !isSelected && !isCorrect ? "opacity-60" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <motion.button
            key={`${i}-${option}`}
            variants={item}
            whileTap={{ scale: 0.97 }}
            disabled={hasAnswered}
            className={className}
            style={{ fontSize: "1.6rem", lineHeight: "2.6rem" }}
            onClick={() => dispatch({ type: "newAnswer", payload: i })}
            aria-pressed={isSelected}
            aria-label={
              hasAnswered
                ? isSelected
                  ? isCorrect
                    ? `${option} — correct`
                    : `${option} — wrong`
                  : option
                : option
            }
          >
            <span className="flex items-center justify-end gap-2">
              {option}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default Options;
