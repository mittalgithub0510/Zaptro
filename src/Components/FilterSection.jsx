import React from "react";

const FilterSection = ({ filters, setFilters, categories }) => {

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === cat ? "" : cat
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      maxPrice: 10000,
      minRating: 0
    });
  };

  return (
    <div className="filter-sidebar">

      <h2 className="filter-title"> Filter Products</h2>

      {/* CATEGORY */}
      <div className="filter-group">
        <p className="filter-label">Category</p>

        {/* ALL OPTION */}
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={filters.category === ""}
            onChange={() => setFilters(prev => ({ ...prev, category: "" }))}
          />
          All Products
        </label>

        {categories.map(cat => (
          <label key={cat} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={filters.category === cat}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* PRICE */}
      <div className="filter-group">
        <p className="filter-label">
          Max Price: ₹ {filters.maxPrice}
        </p>

        <input
        className="range"
          type="range"
          min="0"
          max="10000"
          step="10"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters(prev => ({
              ...prev,
              maxPrice: Number(e.target.value)
            }))
          }
        />
      </div>

      {/* CLEAR BUTTON */}
      <button className="clear-btn" onClick={clearFilters}>
      Clear Filters
      </button>

    </div>
  );
};

export default FilterSection;