/**
 * Frontend config — points to the backend API.
 * Set REACT_APP_API_URL in .env (or in your host's env vars for production).
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
