import React, { useContext } from 'react';
import { DataContext } from '../Context/DataContext';
import { Filter, X } from 'lucide-react';

const FilterPanel = () => {
  const { 
    filters, 
    setFilters, 
    sortBy, 
    setSortBy, 
    getCategories,
    getFilteredProducts 
  } = useContext(DataContext);
  
  const categories = getCategories();
  const filteredCount = getFilteredProducts().length;

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      inStock: true
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">
          <Filter size={18} />
          Filters
        </h3>
        <button onClick={clearFilters} className="clear-filters">
          <X size={16} />
        </button>
      </div>

      <div className="filter-content">
        {/* Category Filter */}
        <div className="filter-section">
          <h4>Category</h4>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="price-input"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="price-input"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h4>Rating</h4>
          <div className="rating-options">
            <label className="rating-option">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === '4'}
                onChange={() => handleFilterChange('rating', '4')}
              />
              4★ & above
            </label>
            <label className="rating-option">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === '3'}
                onChange={() => handleFilterChange('rating', '3')}
              />
              3★ & above
            </label>
          </div>
        </div>

        {/* Availability */}
        <div className="filter-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            />
            In Stock Only
          </label>
        </div>

        {/* Sort */}
        <div className="filter-section">
          <h4>Sort By</h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      <div className="filter-footer">
        <span className="results-count">{filteredCount} products found</span>
      </div>
    </div>
  );
};

export default FilterPanel;
