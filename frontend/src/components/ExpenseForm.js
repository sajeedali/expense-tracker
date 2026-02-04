import React, { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ categories, onAddExpense, currencySymbols = {}, selectedCurrency = 'USD', onCurrencyChange }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: categories[0] || 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  // currency is driven by global selection from IncomeForm
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currencySymbol = currencySymbols[selectedCurrency] || '$';

  const currencyCodes = Object.keys(currencySymbols).sort();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      setSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      setSubmitting(false);
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      setSubmitting(false);
      return;
    }

      const result = await onAddExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      date: formData.date,
      currency: selectedCurrency,
    });

    if (result.success) {
      setSuccess(true);
      // Reset form
      setFormData({
        amount: '',
        category: categories[0] || 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to add expense');
    }

    setSubmitting(false);
  };

  return (
    <div className="expense-form-card">
      <h2>Add New Expense</h2>
      
      {/* Currency selection */}
      <div className="form-currency-selector">
        <label htmlFor="form-currency-select">Currency:</label>
        {onCurrencyChange ? (
          <select 
            id="form-currency-select"
            value={selectedCurrency} 
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="form-currency-dropdown"
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code} ({currencySymbols[code]})
              </option>
            ))}
          </select>
        ) : (
          <div style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
            {selectedCurrency} ({currencySymbols[selectedCurrency]})
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount ({currencySymbol})</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">Expense added successfully!</div>}

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
