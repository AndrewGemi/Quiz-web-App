import React from "react";
import { motion } from "framer-motion";

function NextButton({ index, numQuestions, dispatch, answer }) {
  if (answer === null) return null;

  const isLast = index >= numQuestions - 1;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => dispatch({ type: "nextQuestion" })}
      className={`btn-primary ${isLast ? "btn-emerald" : ""} text-lg px-7 py-3 rounded-2xl w-full sm:w-auto shadow-2xl self-end mt-3`}
      aria-label={isLast ? "Finish Category" : "Next Question"}
    >
      {isLast ? "🏆 Complete Category" : "Next Question →"}
    </motion.button>
  );
}

export default NextButton;
