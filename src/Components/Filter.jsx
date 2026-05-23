import React, { useState, useContext } from 'react';
import { DataContext } from '../Context/DataContext';
import { Search, Filter, X } from 'lucide-react';

const FilterComponent = () => {
  const { filters, updateFilters, data } = useContext(DataContext);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get unique categories from products
  const categories = [...new Set(data?.map(product => product.category) || [])];

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const clearFilters = () => {
    updateFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      rating: 0
    });
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'p-4' : 'p-6'} bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm bg-white/95`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span>Search Products</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by name or description..."
            className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Price Range (₹)
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              placeholder="Min"
              min="0"
              className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <span className="text-gray-400 font-medium">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              placeholder="Max"
              min="0"
              className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Minimum Rating
        </label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
          className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
        >
          <option value={0}>All Ratings</option>
          <option value={3}>3+ Stars ⭐⭐⭐</option>
          <option value={4}>4+ Stars ⭐⭐⭐⭐</option>
          <option value={4.5}>4.5+ Stars ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      {/* Active Filters Display */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h4>
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <Search className="w-3 h-3 mr-1" />
              {filters.search}
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white">
              {filters.category}
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              ₹{filters.minPrice} - ₹{filters.maxPrice}
            </span>
          )}
          {filters.rating > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              ⭐ {filters.rating}+ Stars
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          <div className="bg-white/20 px-2 py-1 rounded-full text-xs">
            {Object.values(filters).filter(v => v !== '' && v !== 0 && v !== 10000).length}
          </div>
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterSection />
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-50">
              <FilterSection isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterComponent;
