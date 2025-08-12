function CategorySelection({ categories, onSelect, completedCategories }) {
  console.log(categories);
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-600">Loading categories...</div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-center mb-8 ">Choose category</h2>
      <div className="grid gap-4">
        {categories.map((category, index) => (
          <button
            key={category.title}
            className={`p-4  text-right rounded-lg transition-colors transform hover:scale-105 duration-200 ${
              completedCategories.includes(index)
                ? "bg-green-100 text-green-800 border-2 border-green-300"
                : " text-white border-2 borChooserple-200 hover:bg-[var(--color-dark)] hover:border-purple-300"
            } shadow-md`}
            onClick={() => onSelect(index)}
            disabled={completedCategories.includes(index)}
          >
            <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelection;
