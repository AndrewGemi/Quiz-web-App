import React, { useState } from "react";

function TeamSetup({ onConfirm }) {
  const [teamInput, setTeamInput] = useState("");
  const [teams, setTeams] = useState([]);

  function handleAddTeam(e) {
    e.preventDefault();
    const name = teamInput.trim();
    if (!name) return;
    setTeams((t) => [...t, name]);
    setTeamInput("");
  }

  function handleSubmit() {
    if (teams.length >= 2) onConfirm(teams);
  }

  function removeTeam(name) {
    setTeams((prev) => prev.filter((t) => t !== name));
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 items-center">
      {/* Titles */}
      <h1 className="text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-7xl mb-2">
        Welcome to{" "}
        <span className="text-[color:var(--color-theme)]">Quizify</span>
      </h1>
      <h2 className="text-center text-lg sm:text-xl md:text-3xl font-semibold mb-5">
        Enter Team Names
      </h2>

      {/* Input row */}
      <form onSubmit={handleAddTeam} className="w-full max-w-[720px] mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
          <input
            type="text"
            value={teamInput}
            onChange={(e) => setTeamInput(e.target.value)}
            placeholder="Enter team name..."
            className="w-full rounded-[14px] border border-[#2a2f3c] bg-[#0d1018] text-[1.6rem] text-[var(--color-light)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
            aria-label="Team name"
          />
          <button
            type="submit"
            className="btn w-full sm:w-auto"
            style={{
              background: "linear-gradient(90deg,#7c3aed,#5b21b6)",
              borderRadius: 14,
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Add Team
          </button>
        </div>
      </form>

      {/* Teams list */}
      <div className="w-full max-w-[720px] mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((team, index) => (
            <div
              key={team}
              className="card flex items-center justify-between border border-[#6b05fa] rounded-[14px] p-3 anim-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-[1.6rem] font-medium truncate">
                Team {index + 1}: {team}
              </span>
              <button
                onClick={() => removeTeam(team)}
                className="ml-3 shrink-0 rounded-md px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                aria-label={`Remove ${team}`}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {teams.length > 6 && (
          <div className="mt-2 text-center text-sm text-gray-400">
            Tip: scroll for more teams
          </div>
        )}
      </div>

      {/* CTA */}
      {teams.length >= 2 ? (
        <button
          onClick={handleSubmit}
          className="btn w-full sm:w-auto"
          style={{
            background: "linear-gradient(90deg,#10b981,#059669)",
            borderRadius: 14,
            padding: "12px 22px",
            fontSize: "1.7rem",
            fontWeight: 800,
          }}
        >
          Start Quiz
        </button>
      ) : (
        <p className="text-center opacity-80 text-[1.5rem]">
          Add at least 2 teams to continue
        </p>
      )}
    </div>
  );
}

export default TeamSetup;
