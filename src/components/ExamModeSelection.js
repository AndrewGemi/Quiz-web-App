// src/ExamModeSelection.jsx
import { motion } from "framer-motion";

export default function ExamModeSelection({ onPick }) {
  const Card = ({ onClick, title, subtitle, meta, className }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={
        "rounded-xl p-5 text-left shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 " +
        className
      }
      aria-label={title}
    >
      <div className="text-xl lg:text-2xl font-bold mb-1">{title}</div>
      <p className="text-sm lg:text-lg opacity-80">{subtitle}</p>
      <div className="mt-3 text-xs lg:text-base opacity-70">{meta}</div>
    </motion.button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-center mb-6">
        Choose Exam Mode
      </h1>
      <p className="text-center opacity-80 mb-8 lg:text-lg">
        Pick how you want to play. You can change this later by restarting.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Trial Exam */}
        <Card
          onClick={() => onPick("trial")}
          title="Trial Exam"
          subtitle="Standard quiz flow. Uses question points and your selected categories."
          meta="Default: 20s per question"
          className="border border-purple-400/30 bg-purple-900/20 hover:bg-purple-900/30"
        />

        {/* Penalty Shootout */}
        <Card
          onClick={() => onPick("shootout")}
          title="Penalty Shootout"
          subtitle="Quick-fire kicks! Each correct = 1 point. Rotates teams each question."
          meta="Default: 20s per question" // <- fixed to match config
          className="border border-emerald-400/30 bg-emerald-900/20 hover:bg-emerald-900/30"
        />
      </div>

      {/* OPTIONAL: Real Exam tile (uncomment if you want users to pick the real exam explicitly) */}

      <div className="grid gap-4 sm:grid-cols-1 mt-4">
        <Card
          onClick={() => onPick("real")}
          title="Real Exam"
          subtitle="Live set used for the official round. Uses question points from the real pool."
          meta="Default: 20s per question"
          className="border border-indigo-400/30 bg-indigo-900/20 hover:bg-indigo-900/30"
        />
      </div>
    </div>
  );
}
