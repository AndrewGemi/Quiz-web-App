// FinishScreen.jsx
function FinishScreen({
  points,
  totalPoints,
  categoryTitle,
  dispatch,
  hasMoreCategories,
}) {
  const safePoints = points || {};
  const safeTotalPoints = totalPoints || {};

  const teamScores = Object.entries(safePoints)
    .map(([team, score]) => ({ team, score: Number(score) || 0 }))
    .sort((a, b) => b.score - a.score);

  let rankedTotals = [];
  if (!hasMoreCategories) {
    const allTeams = Array.from(
      new Set([...Object.keys(safeTotalPoints), ...Object.keys(safePoints)])
    );
    const mergedTotals = allTeams
      .map((team) => ({
        team,
        total:
          (Number(safeTotalPoints[team]) || 0) +
          (Number(safePoints[team]) || 0),
      }))
      .sort((a, b) => b.total - a.total);

    let lastScore = null;
    let lastRank = 0;
    rankedTotals = mergedTotals.map((t, idx) => {
      const rank = t.total === lastScore ? lastRank : idx + 1;
      lastScore = t.total;
      lastRank = rank;
      return { ...t, rank, isWinner: rank === 1 };
    });
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-2 sm:px-0">
      {hasMoreCategories && (
        <>
          <div className="mb-6 text-center">
            <h2 className="mb-1">{categoryTitle || "Category Complete"}</h2>
            <p className="opacity-80 mb-4">Category Results</p>

            {teamScores.length > 0 ? (
              <div className="grid gap-3">
                {teamScores.map(({ team, score }, i) => (
                  <div
                    key={team}
                    className={[
                      "card border-l-4",
                      i === 0
                        ? "bg-yellow-900/15 border-yellow-400"
                        : "bg-[#141a28] border-purple-500",
                    ].join(" ")}
                    style={{ padding: 12 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[1.8rem] font-semibold">
                        {team}
                      </span>
                      <span
                        className={
                          i === 0
                            ? "text-yellow-300 text-[2.2rem] font-bold"
                            : "text-purple-300 text-[2.2rem] font-bold"
                        }
                      >
                        {score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No team scores available</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              className="btn"
              style={{ background: "linear-gradient(90deg,#7c3aed,#5b21b6)" }}
              onClick={() => dispatch({ type: "categoryComplete" })}
            >
              Next Category
            </button>
          </div>
        </>
      )}

      {!hasMoreCategories && (
        <>
          <div className="mb-4 text-center">
            <h2 className="mb-1">Final Leaderboard</h2>
            <p className="opacity-80 text-[1.4rem]">
              {categoryTitle ? `Including: ${categoryTitle}` : ""}
            </p>
          </div>

          <div
            className="card"
            style={{
              background: "linear-gradient(135deg,#1b1230,#26143f)",
              padding: 14,
            }}
          >
            <div className="space-y-3">
              {rankedTotals.map(({ team, total, rank, isWinner }) => (
                <div
                  key={team}
                  className={[
                    "relative rounded-lg shadow-lg transition-transform",
                    "hover:scale-[1.01]",
                    isWinner
                      ? "bg-yellow-300 text-[#2a1a00]"
                      : "bg-[#f8fafc] text-[#1f2937]",
                  ].join(" ")}
                  style={{ padding: 14 }}
                >
                  <div className="absolute -left-3 -top-3 w-9 h-9 rounded-full bg-[#6b05fa] text-white flex items-center justify-center text-[1.6rem] font-bold shadow">
                    {rank}
                  </div>

                  <div className="flex justify-between items-center ml-6">
                    <div className="text-[1.8rem] font-bold">{team}</div>
                    <div className="text-[2rem] font-extrabold">{total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="btn"
              style={{ background: "linear-gradient(90deg,#10b981,#059669)" }}
              onClick={() => dispatch({ type: "restart" })}
            >
              Play Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FinishScreen;
