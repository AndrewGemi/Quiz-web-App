function FinishScreen({
  points,
  totalPoints,
  categoryTitle,
  dispatch,
  hasMoreCategories,
}) {
  const safePoints = points || {};
  const safeTotalPoints = totalPoints || {};

  // Category standings (this category only)
  const teamScores = Object.entries(safePoints)
    .map(([team, score]) => ({ team, score: Number(score) || 0 }))
    .sort((a, b) => b.score - a.score);

  // If it's the final category, build the final leaderboard by merging
  // current category points into the cumulative totals just for display.
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

    // Tie-aware ranking
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
    <div className="max-w-3xl mx-auto p-8">
      {/* When there ARE more categories: show the category scoreboard only */}
      {hasMoreCategories && (
        <>
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-2">
              {categoryTitle || "Category Complete"}
            </h2>
            <p className="opacity-80 mb-8">Category Results</p>

            {teamScores.length > 0 ? (
              <div className="grid gap-4">
                {teamScores.map(({ team, score }, i) => (
                  <div
                    key={team}
                    className={`rounded-lg p-4 shadow-md border-l-4 transition-shadow hover:shadow-lg ${
                      i === 0
                        ? "bg-yellow-50 border-yellow-400"
                        : "bg-white border-purple-500"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-medium text-gray-800">
                        {team}
                      </span>
                      <span
                        className={`text-3xl font-bold ${
                          i === 0 ? "text-yellow-600" : "text-purple-600"
                        }`}
                      >
                        {score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No team scores available</p>
            )}
          </div>

          {/* Next Category Button */}
          <div className="flex justify-center">
            <button
              className="px-8 py-4 rounded-full text-xl font-bold shadow-lg transform transition-all hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900"
              onClick={() => dispatch({ type: "categoryComplete" })}
            >
              Next Category
            </button>
          </div>
        </>
      )}

      {/* When it's the LAST category: show the FINAL leaderboard only */}
      {!hasMoreCategories && (
        <>
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-2">Final Leaderboard</h2>
            <p className="opacity-80">
              {categoryTitle ? `Including: ${categoryTitle}` : ""}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl shadow-xl p-8 mb-8">
            <div className="space-y-6">
              {rankedTotals.map(({ team, total, rank, isWinner }) => (
                <div
                  key={team}
                  className={`relative rounded-lg p-6 shadow-lg transition-all duration-300 hover:scale-105 ${
                    isWinner
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-yellow-200/50"
                      : "bg-white"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-purple-900 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {rank}
                  </div>

                  <div className="flex justify-between items-center ml-6">
                    <div className="text-2xl font-bold text-purple-900">
                      {team}
                    </div>
                    <div className="text-3xl font-bold text-purple-900">
                      {total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Play Again Button */}
          <div className="flex justify-center">
            <button
              className="px-8 py-4 rounded-full text-xl font-bold shadow-lg transform transition-all hover:shadow-xl hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
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
