import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <div>
        <h1 className="hero-title">
          Craft a resume that sounds like you, only sharper.
        </h1>
        <p className="hero-subtitle">
          Build a structured resume in minutes, then refine every section with
          AI-guided enhancements. Clean layout, job-ready language, zero fluff.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/builder">
            Start Building
          </Link>
          <Link className="button ghost" to="/signup">
            Create Account
          </Link>
        </div>
        <div className="card-grid">
          <div className="card">
            <h3>Guided Sections</h3>
            <p>Focus on the content while the structure stays consistent.</p>
          </div>
          <div className="card">
            <h3>AI Polish</h3>
            <p>Turn raw details into concise, recruiter-ready copy.</p>
          </div>
          <div className="card">
            <h3>Export Ready</h3>
            <p>Preview instantly and export once the layout feels perfect.</p>
          </div>
        </div>
      </div>
      <div className="hero-card">
        <p className="section-title">Resume Scorecard</p>
        <p className="hero-subtitle">
          See what hiring managers notice first. Balance the story across
          skills, impact, and clarity.
        </p>
        <div className="card-grid">
          <div className="card">
            <strong>Impact</strong>
            <p>Quantified achievements and measurable outcomes.</p>
          </div>
          <div className="card">
            <strong>Clarity</strong>
            <p>Short, confident lines with zero filler.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
