import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, [token]);

  const register = async ({ username, email, password }) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res;
  };

  const login = async ({ usernameOrEmail, password }) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
    });

    if (!res.ok) return { ok: false, status: res.status, data: await res.json().catch(() => null) };
    const data = await res.json();
    setToken(data.token);
    // decode minimal info from token or request user info; store id placeholder
    // keep username in local state for display
    setUser({ username: usernameOrEmail });
    return { ok: true, data };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const authFetch = async (input, init = {}) => {
    const headers = init.headers ? { ...init.headers } : {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(input, { ...init, headers });
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
