import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Statistics from './components/Statistics';
import Filter from './components/Filter';

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories] = useState([
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other"
  ]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');

  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'AUD': 'A$',
    'CAD': 'C$',
    'JPY': '¥',
    'CNY': '¥',
    'MXN': '$',
    'BRL': 'R$',
    'AED': 'د.إ',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NZD': 'NZ$',
    'CHF': 'CHF',
  };

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Apply theme to body class
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);


  const updateStatistics = (expenseList, selectedCurrency) => {
    // Filter expenses by selected currency (default to USD for old expenses without currency field)
    const currencyExpenses = expenseList.filter(exp => (exp.currency || 'USD') === selectedCurrency);
    
    if (!currencyExpenses || currencyExpenses.length === 0) {
      return {
        total: 0,
        count: 0,
        average: 0,
        byCategory: [],
        byMonth: []
      };
    }

    const total = currencyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = currencyExpenses.length;
    const avg = total / count;

    // Category breakdown
    const categoryTotals = {};
    currencyExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const byCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / total) * 1000) / 10
      }));

    // Monthly breakdown
    const monthTotals = {};
    const monthCounts = {};
    currencyExpenses.forEach(exp => {
      try {
        const date = new Date(exp.date);
        const monthKey = date.toISOString().slice(0, 7);
        monthTotals[monthKey] = (monthTotals[monthKey] || 0) + exp.amount;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      } catch (e) {
        // skip malformed dates
      }
    });

    const byMonth = Object.keys(monthTotals)
      .sort()
      .reverse()
      .map(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthLabel = new Date(year, month - 1).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
        return {
          month: monthLabel,
          total: Math.round(monthTotals[monthKey] * 100) / 100,
          count: monthCounts[monthKey],
          average: Math.round((monthTotals[monthKey] / monthCounts[monthKey]) * 100) / 100
        };
      });

    return {
      total: Math.round(total * 100) / 100,
      count,
      average: Math.round(avg * 100) / 100,
      byCategory,
      byMonth
    };
  };

  const getFilteredExpenses = () => {
    let filtered = expenses;
    if (filterCategory !== 'All') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = {
        id: Math.max(...expenses.map(e => e.id || 0), 0) + 1,
        ...expenseData
      };
      setExpenses([...expenses, newExpense]);
      setError(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleFilterChange = (category) => {
    setFilterCategory(category);
  };

  const handleClearFilter = () => {
    setFilterCategory('All');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const filteredExpenses = getFilteredExpenses();

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header-title">
          <h1>Expense Tracker</h1>
          <p className="app-header-subtitle">Track your spending with clear monthly insights</p>
        </div>
        <div className="app-header-controls">
          <button className="theme-toggle-button" onClick={toggleTheme}>
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="app-container">
        <div className="left-panel">
          <ExpenseForm 
            categories={categories}
            onAddExpense={handleAddExpense}
            currencySymbols={currencySymbols}
          />
        </div>

        <div className="right-panel">
          <Statistics 
            expenses={expenses}
            currencySymbols={currencySymbols}
            updateStatistics={updateStatistics}
          />
          
          <Filter
            categories={categories}
            selectedCategory={filterCategory}
            onFilterChange={handleFilterChange}
            onClearFilter={handleClearFilter}
          />

          <ExpenseList
            expenses={filteredExpenses}
            onDeleteExpense={handleDeleteExpense}
            currencySymbols={currencySymbols}
          />
        </div>
      </div>
    </div>
  );
}

export default App;