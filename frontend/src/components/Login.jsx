import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login({ usernameOrEmail: username, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.data?.error || 'Invalid credentials');
      return;
    }
    onSuccess && onSuccess();
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Username or Email</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      </form>
      <div className="auth-switch">
        <span>New here?</span> <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
