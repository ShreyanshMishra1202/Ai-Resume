import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <section className="form-card">
      <h2 className="section-title">Create your workspace</h2>
      <p className="hero-subtitle">
        Save drafts, access AI enhancements, and export anytime.
      </p>
      <form>
        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" placeholder="Shreyansh Mishra" />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@email.com" />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
        <button className="button primary" type="submit">
          Create Account
        </button>
      </form>
      <p className="auth-alt">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
