import React from "react";

const CategorySuggestions = ({ categories, onCategoryClick }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="zaptro-ai-chip-row">
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          className="zaptro-ai-chip"
          onClick={() => onCategoryClick?.(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

export default CategorySuggestions;

