import React, { useState } from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, loading, onDeleteExpense, currencySymbols = {} }) {
  const defaultCurrencySymbols = {
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

  const symbolsMap = Object.keys(currencySymbols).length > 0 ? currencySymbols : defaultCurrencySymbols;

  const getExpenseCurrency = (expense) => {
    return symbolsMap[expense.currency] || '$';
  };
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(expenseId);
    const result = await onDeleteExpense(expenseId);
    setDeletingId(null);

    if (!result.success) {
      alert(result.error || 'Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <div className="expense-list-card">
        <h2>Expenses List</h2>
        <div className="loading">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="expense-list-card">
      <h2>Expenses List</h2>
      
      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add your first expense to get started!</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td data-label="Date">{expense.date}</td>
                    <td data-label="Category">
                      <span className="category-badge">{expense.category}</span>
                    </td>
                    <td data-label="Description">{expense.description}</td>
                    <td data-label="Amount" className="amount-cell">{getExpenseCurrency(expense)}{expense.amount.toFixed(2)}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                      >
                        {deletingId === expense.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="expense-count">
            Total: {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;
