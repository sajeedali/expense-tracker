import React, { useState } from 'react';
import './Statistics.css';

function Statistics({ expenses = [], currencySymbols = {}, updateStatistics }) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currencyCodes = Object.keys(currencySymbols).length > 0 
    ? Object.keys(currencySymbols)
    : ['USD'];

  const statistics = updateStatistics(expenses, selectedCurrency);

  if (!statistics) {
    return (
      <div className="statistics-card">
        <h2>Statistics</h2>
        <div className="empty-state">No data available</div>
      </div>
    );
  }

  const currencySymbol = currencySymbols[selectedCurrency] || '$';
  const { total, count, average, byCategory, byMonth } = statistics;

  return (
    <div className="statistics-card">
      <div className="statistics-header">
        <h2>Statistics</h2>
        <div className="currency-selector-stats">
          <label htmlFor="stats-currency">View in:</label>
          <select 
            id="stats-currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="currency-dropdown-stats"
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code} ({currencySymbols[code]})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{currencySymbol}{total.toFixed(2)}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Number of Expenses</div>
          <div className="stat-value">{count}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Average Expense</div>
          <div className="stat-value">{currencySymbol}{average.toFixed(2)}</div>
        </div>
      </div>

      {byMonth && byMonth.length > 0 && (
        <div className="monthly-breakdown">
          <h3>By Month</h3>
          <div className="month-list">
            {byMonth.map((item, index) => (
              <div key={index} className="month-item">
                <div className="month-header">
                  <span className="month-name">{item.month}</span>
                  <span className="month-amount">{currencySymbol}{item.total.toFixed(2)}</span>
                </div>
                <div className="month-details">
                  <span>{item.count} expense{item.count !== 1 ? 's' : ''}</span>
                  <span>Avg: {currencySymbol}{item.average.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {byCategory && byCategory.length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          <div className="category-list">
            {byCategory.map((item, index) => (
              <div key={index} className="category-item">
                <div className="category-header">
                  <span className="category-name">{item.category}</span>
                  <span className="category-amount">{currencySymbol}{item.amount.toFixed(2)}</span>
                </div>
                <div className="category-bar-container">
                  <div 
                    className="category-bar"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="category-percentage">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistics;
