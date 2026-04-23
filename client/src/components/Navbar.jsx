import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const getLinkClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link';

export default function Navbar() {
  const { user, token, logout } = useAuth();

  return (
    <header className="nav">
      <NavLink to="/" className="nav-brand">
        AI Resume Builder
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/" className={getLinkClass}>
          Home
        </NavLink>
        <NavLink to="/builder" className={getLinkClass}>
          Builder
        </NavLink>
        {token ? (
          <div className="nav-user">
            <span>{user?.name || 'Account'}</span>
            <button className="button ghost" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/login" className={getLinkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className="button primary">
              Sign Up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
