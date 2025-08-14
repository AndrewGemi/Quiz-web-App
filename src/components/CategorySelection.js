// CategorySelection.jsx
function CategorySelection({ categories, onSelect, completedCategories }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] flex flex-col gap-6">
      <h2 className="text-center mb-4 md:text-5xl">Choose category</h2>

      <div className="grid gap-5">
        {categories.map((category, index) => {
          const done = completedCategories.includes(index);
          return (
            <button
              key={category.title}
              onClick={() => onSelect(index)}
              disabled={done}
              className={[
                "card w-full text-right transition-transform",
                "active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-purple-500/60",
                "border border-[#232836] md:text-xl flex flex-col gap-4",
                done
                  ? "bg-green-900/20 text-green-200 border-green-700 cursor-not-allowed"
                  : "hover:bg-[#1b2131]",
              ].join(" ")}
              style={{ padding: "14px 16px", borderRadius: 14, minHeight: 56 }}
            >
              <h3 className="m-0">{category.title}</h3>
              {done && (
                <p className="m-0 text-[1.2rem] opacity-70">Completed</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySelection;
