import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  education: '',
  skills: '',
  experience: '',
  projects: '',
  summary: ''
};

export default function Builder() {
  const { token } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [resumeId, setResumeId] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    if (!token) return;

    const loadLatest = async () => {
      setLoading(true);
      setStatus('Loading your latest resume...');
      try {
        const resumes = await api.listResumes(token);
        if (resumes.length > 0) {
          setResumeId(resumes[0]._id);
          setFormData({ ...EMPTY_FORM, ...resumes[0] });
        }
        setStatus('');
      } catch (error) {
        setStatus(error.message || 'Unable to load resumes.');
      } finally {
        setLoading(false);
      }
    };

    loadLatest();
  }, [token]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    setStatus('Saving...');
    try {
      const payload = { ...formData };
      const result = resumeId
        ? await api.updateResume(token, resumeId, payload)
        : await api.createResume(token, payload);
      setResumeId(result._id);
      setStatus('Saved just now.');
    } catch (error) {
      setStatus(error.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!token) return;
    setEnhancing(true);
    setStatus('Enhancing summary and skills...');
    try {
      const result = await api.enhanceResume(token, {
        summary: formData.summary,
        skills: formData.skills
      });
      setFormData((prev) => ({
        ...prev,
        summary: result.summary,
        skills: result.skills
      }));
      setStatus('AI enhancement applied.');
    } catch (error) {
      setStatus(error.message || 'Enhancement failed.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleExport = () => {
    window.print();
  };

  if (!token) {
    return (
      <section>
        <div className="section-title">Builder Workspace</div>
        <p className="hero-subtitle">
          Please sign in to save and enhance your resume.
        </p>
        <Link className="button primary" to="/login">
          Sign in to continue
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="section-title">Builder Workspace</div>
      <p className="hero-subtitle">
        Draft your resume sections and save progress as you go.
      </p>
      <div className="builder-grid">
        <div className="panel">
          <h3>Resume Details</h3>
          <div className="form-field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="summary">Summary</label>
            <input id="summary" name="summary" value={formData.summary} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="skills">Skills</label>
            <input id="skills" name="skills" value={formData.skills} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="experience">Experience</label>
            <input id="experience" name="experience" value={formData.experience} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="projects">Projects</label>
            <input id="projects" name="projects" value={formData.projects} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="education">Education</label>
            <input id="education" name="education" value={formData.education} onChange={handleChange} />
          </div>
          <button className="button primary" type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Resume'}
          </button>
          <button className="button ghost" type="button" onClick={handleEnhance} disabled={enhancing}>
            {enhancing ? 'Enhancing...' : 'Enhance with AI'}
          </button>
          {status ? <p className="auth-alt">{status}</p> : null}
        </div>
        <div className="panel">
          <h3>Live Preview</h3>
          <p className="hero-subtitle">{formData.summary || 'Add a summary to preview.'}</p>
          <div className="resume-preview">
            <div className="resume-header">
              <h2>{formData.name || 'Your Name'}</h2>
              <p>{formData.email || 'email@example.com'} • {formData.phone || 'Phone'}</p>
            </div>
            <div className="resume-section">
              <h4>Summary</h4>
              <p>{formData.summary || 'Write a concise professional summary.'}</p>
            </div>
            <div className="resume-section">
              <h4>Skills</h4>
              <p>{formData.skills || 'Add skill keywords.'}</p>
            </div>
            <div className="resume-section">
              <h4>Experience</h4>
              <p>{formData.experience || 'Outline your most impactful experience.'}</p>
            </div>
            <div className="resume-section">
              <h4>Projects</h4>
              <p>{formData.projects || 'Showcase the projects you are proud of.'}</p>
            </div>
            <div className="resume-section">
              <h4>Education</h4>
              <p>{formData.education || 'Include your latest education details.'}</p>
            </div>
          </div>
          <button className="button primary" type="button" onClick={handleExport}>
            Export PDF
          </button>
        </div>
      </div>
    </section>
  );
}
