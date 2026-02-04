import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Statistics.css';

function Statistics({ expenses = [], currencySymbols = {}, updateStatistics, selectedCurrency = 'USD', onCurrencyChange }) {

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
  const { total, average, byMonth, byCategory, count } = statistics;

  const currencyCodes = Object.keys(currencySymbols).sort();

  // Get category pie data
  const getCategoryPieData = () => {
    if (!byCategory || byCategory.length === 0) return [];
    return byCategory.map((cat) => ({
      name: cat.category,
      value: cat.amount,
      color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#0ea5e9', '#8b5cf6', '#ec4899', '#6366f1'][byCategory.indexOf(cat) % 8]
    }));
  };

  const categoryPieData = getCategoryPieData();

  // Get expenses for the current week (Monday - Sunday)
  const getCurrentWeekExpenses = () => {
    const days = [];
    const today = new Date();

    // find Monday of current week
    const day = today.getDay();
    const diffToMonday = (day + 6) % 7; // days since Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayTotal = expenses
        .filter(exp => {
          try {
            return (exp.date && exp.date.startsWith(iso)) && ((exp.currency || 'USD') === selectedCurrency);
          } catch (e) {
            return false;
          }
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      days.push({ date: iso, label, amount: Math.round(dayTotal * 100) / 100 });
    }

    return days;
  };

  const weekData = getCurrentWeekExpenses();

  // Monthly pie charts with expenses breakdown
  const getMonthlyCharts = () => {
    if (!byMonth || byMonth.length === 0) return [];
    
    return byMonth.map((month) => {
      const monthDate = new Date(month.month + ' 1');
      const monthStr = monthDate.toISOString().slice(0, 7);
      
      const pieData = [
        { name: 'Expenses', value: month.total, color: '#ef4444' }
      ].filter(item => item.value > 0);
      
      return {
        month: month.month,
        pieData,
        expenses: month.total
      };
    });
  };

  const monthlyCharts = getMonthlyCharts();

  // overall pie removed

  return (
    <div className="statistics-container">
      {onCurrencyChange && (
        <div className="currency-selector-container">
          <label htmlFor="currency-select">Currency:</label>
          <select 
            id="currency-select"
            value={selectedCurrency} 
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="currency-dropdown"
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code} ({currencySymbols[code]})
              </option>
            ))}
          </select>
        </div>
      )}

      {total > 0 && (
        <div className="statistics-card">
          <h3>Total Expense Overview</h3>
          <div className="overview-content">
            <div className="overview-stats">
              <div className="stat-box">
                <span className="stat-label">Total Expenses</span>
                <span className="stat-value danger-color">{currencySymbol}{total.toFixed(2)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Average Expense</span>
                <span className="stat-value primary-color">{currencySymbol}{average.toFixed(2)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Transactions</span>
                <span className="stat-value primary-color">{count}</span>
              </div>
            </div>
            {categoryPieData.length > 0 && (
              <div className="overview-pie">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${currencySymbol}${value.toFixed(0)}`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${currencySymbol}${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {monthlyCharts.length > 0 && (
        <div className="monthly-charts-section">
          <h3>Monthly Overview</h3>
          <div className="monthly-charts-grid">
            {monthlyCharts.map((monthData, index) => (
              <div key={index} className="monthly-chart-card">
                <h4>{monthData.month}</h4>
                <div className="monthly-card-content">
                  <div className="monthly-pie-small">
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie
                          data={monthData.pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ value }) => `${currencySymbol}${value.toFixed(0)}`}
                          outerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {monthData.pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${currencySymbol}${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="monthly-card-values">
                    <div className="month-row">
                      <span className="month-label">Expenses</span>
                      <span className="month-value danger-color">{currencySymbol}{monthData.expenses.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weekData.some(d => d.amount > 0) && (
        <div className="statistics-card">
          <h3>This Week Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip 
                formatter={(value) => `${currencySymbol}${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: 'var(--color-bg)',
                  border: `1px solid var(--color-border)`,
                  color: 'var(--color-text)'
                }}
              />
              <Bar dataKey="amount" fill="var(--color-primary)" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Statistics;
