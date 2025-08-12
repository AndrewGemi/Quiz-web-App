import React, { useState } from 'react';

function TeamSetup({ dispatch }) {
    const [teamInput, setTeamInput] = useState("");
    const [teams, setTeams] = useState([]);

    function handleAddTeam(e) {
        e.preventDefault();
        if (!teamInput) return;
        setTeams([...teams, teamInput]);
        setTeamInput("");
    }

    function handleStart() {
        if (teams.length < 2) return;
        dispatch({ type: "setTeams", payload: teams });
        dispatch({ type: "start" });
    }

    return (
        <div className="team-setup">
            <h2>Enter Team Names</h2>
            <form onSubmit={handleAddTeam}>
                <input
                    type="text"
                    placeholder="Enter team name..."
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value)}
                />
                <button className="btn btn-add">Add Team</button>
            </form>
            <div className="teams-list">
                {teams.map(team => (
                    <div key={team} className="team-item">{team}</div>
                ))}
            </div>
            {teams.length >= 2 && (

                <button
                    className="btn hover:bg-sky-500 bg-sky-400 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 mt-4"
                    onClick={handleStart}
                >
                    Start Quiz
                </button>
            )}
        </div>
    );
}
export default TeamSetup;