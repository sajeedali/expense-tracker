import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register({ username, email, password });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }

    // Auto-login after successful registration
    const loginRes = await login({ usernameOrEmail: username, password });
    if (!loginRes.ok) {
      // If auto-login fails, prompt user to login manually
      setError('Registered successfully — please login.');
      setLoading(false);
      onSuccess && onSuccess();
      return;
    }

    setLoading(false);
    onSuccess && onSuccess();
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Register'}</button>
      </form>
      <div className="auth-switch">
        <span>Already registered?</span> <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
