import { NavLink } from 'react-router-dom';

const getLinkClass = ({ isActive }) =>
  isActive ? 'nav-link active' : 'nav-link';

export default function Navbar() {
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
        <NavLink to="/login" className={getLinkClass}>
          Login
        </NavLink>
        <NavLink to="/signup" className="button primary">
          Sign Up
        </NavLink>
      </nav>
    </header>
  );
}
