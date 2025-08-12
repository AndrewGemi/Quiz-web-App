import React, { useState } from "react";

function TeamSetup({ onConfirm }) {
  const [teamInput, setTeamInput] = useState("");
  const [teams, setTeams] = useState([]);

  function handleAddTeam(e) {
    e.preventDefault();
    const name = teamInput.trim();
    if (!name) return;
    setTeams([...teams, name]);
    setTeamInput("");
  }

  function handleSubmit() {
    if (teams.length >= 2) onConfirm(teams);
  }

  function removeTeam(name) {
    setTeams((prev) => prev.filter((t) => t !== name));
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
      {/* Title */}
      <h1 className="w-full text-center font-extrabold tracking-tight text-3xl sm:text-4xl md:text-6xl mb-6 self-center">
        Welcome to <span className="text-[#6b05fa]">Quizify</span>
      </h1>
      <h2 className="w-full text-center text-lg sm:text-xl md:text-3xl font-semibold mb-6 self-center">
        Enter Team Names
      </h2>

      {/* Input */}
      <form
        onSubmit={handleAddTeam}
        className="w-1/2 md:w-3/4 lg:w-3/4 self-center mb-6 mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <input
            type="text"
            value={teamInput}
            onChange={(e) => setTeamInput(e.target.value)}
            placeholder="Enter team name..."
            className="w-full md:flex-1 rounded-lg border-2 border-purple-200 focus:outline-none focus:border-purple-400 px-4 py-3 md:py-4 text-base sm:text-xl text-black"
          />
          <button
            type="submit"
            className="w-full md:w-auto rounded-lg bg-purple-600 text-white px-5 py-3 md:py-4 text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Add Team
          </button>
        </div>
      </form>

      {/* Teams list */}
      <div className="w-1/2 md:w-3/4 mb-8 self-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 self-ce">
          {teams.map((team, index) => (
            <div
              key={team}
              className="w-full rounded-lg border border-[#6b05fa] p-3 sm:p-4 flex items-center justify-between"
            >
              <span className="text-base sm:text-lg md:text-xl font-medium truncate">
                Team {index + 1}: {team}
              </span>
              <button
                onClick={() => removeTeam(team)}
                className="ml-3 shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                aria-label={`Remove ${team}`}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Scroll guard if many teams on mobile */}
        {teams.length > 6 && (
          <div className="mt-2 text-center text-sm text-gray-500">
            Tip: scroll for more teams
          </div>
        )}
      </div>

      {/* CTA */}
      {teams.length >= 2 ? (
        <button
          onClick={handleSubmit}
          className="w-1/2 md:w-auto md:self-center rounded-lg bg-green-500 text-white px-8 py-3 text-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Start Quiz
        </button>
      ) : (
        <p className="text-center opacity-70 text-base sm:text-lg">
          Add at least 2 teams to continue
        </p>
      )}
    </div>
  );
}

export default TeamSetup;
