import React from 'react';
import './Filter.css';

function Filter({ categories, selectedCategory, onFilterChange, onClearFilter }) {
  return (
    <div className="filter-card">
      <h2>Filter</h2>
      <div className="filter-controls">
        <label htmlFor="category-filter">Category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={onClearFilter}
          className="clear-filter-button"
          disabled={selectedCategory === 'All'}
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
}

export default Filter;
