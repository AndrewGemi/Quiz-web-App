import React from "react";
import { motion } from "framer-motion";

function NextButton({ index, numQuestions, dispatch, answer, isLastCategory = true }) {
  if (answer === null) return null;

  const isLast = index >= numQuestions - 1;

  let buttonText = "Next Question →";
  if (isLast) {
    buttonText = isLastCategory
      ? "🏆 Complete Tournament"
      : "✓ Complete Round (Pick Next Topic) →";
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => dispatch({ type: "nextQuestion" })}
      className={`btn-primary ${isLast ? "btn-emerald" : ""} text-base sm:text-lg px-7 py-3.5 rounded-2xl w-full sm:w-auto shadow-2xl self-end mt-3 flex items-center justify-center gap-2 cursor-pointer font-black`}
      aria-label={
        isLast
          ? isLastCategory
            ? "Complete Tournament"
            : "Complete Category Round"
          : "Next Question"
      }
      type="button"
    >
      <span>{buttonText}</span>
    </motion.button>
  );
}

export default NextButton;
