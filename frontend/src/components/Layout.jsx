import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <h1>Expense Tracker & Budget Planner</h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <span className="user">Hi, {user?.username}</span>
          <button type="button" onClick={handleLogout} className="btn-logout">Logout</button>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
