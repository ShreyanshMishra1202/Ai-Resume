import { Link } from 'react-router-dom';

export default function Builder() {
  return (
    <section>
      <div className="section-title">Builder Workspace</div>
      <p className="hero-subtitle">
        Draft your resume sections on the left and watch the preview refresh on
        the right. Save progress as you go.
      </p>
      <div className="builder-grid">
        <div className="panel">
          <h3>Resume Details</h3>
          <p className="hero-subtitle">
            Section-by-section inputs will live here next. We will connect this
            to the API and AI enhancer.
          </p>
          <Link className="button ghost" to="/signup">
            Save drafts with an account
          </Link>
        </div>
        <div className="panel">
          <h3>Live Preview</h3>
          <p className="hero-subtitle">
            Resume preview will render here with export tools.
          </p>
          <button className="button primary">Export PDF</button>
        </div>
      </div>
    </section>
  );
}
