import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <section className="form-card">
      <h2 className="section-title">Welcome back</h2>
      <p className="hero-subtitle">Sign in to continue building your resume.</p>
      <form>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@email.com" />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
        <button className="button primary" type="submit">
          Sign In
        </button>
      </form>
      <p className="auth-alt">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </section>
  );
}
