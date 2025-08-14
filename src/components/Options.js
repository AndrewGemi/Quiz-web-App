import { motion } from "framer-motion";

const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
      {question.options.map((option, i) => (
        <motion.button
          key={option}
          variants={item}
          whileTap={{ scale: 0.97 }}
          disabled={hasAnswered}
          className={`btn btn-option ${
            hasAnswered
              ? i === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          style={{ fontSize: "1.8rem", lineHeight: "2.8rem" }}
          onClick={() => dispatch({ type: "newAnswer", payload: i })}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
}

export default Options;
