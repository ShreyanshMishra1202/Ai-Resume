import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ResumePreview from '../components/ResumePreview.jsx';

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
  const [resumes, setResumes] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const skipAutoSave = useRef(false);
  const previewRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const loadLatest = async () => {
      setLoading(true);
      setStatus('Loading your latest resume...');
      try {
        const resumes = await api.listResumes(token);
        setResumes(resumes);
        if (resumes.length > 0) {
          setResumeId(resumes[0]._id);
          setFormData({ ...EMPTY_FORM, ...resumes[0] });
          skipAutoSave.current = true;
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

  useEffect(() => {
    if (!token) return;
    if (skipAutoSave.current) {
      skipAutoSave.current = false;
      return;
    }

    const hasContent = Object.values(formData).some((value) => value.trim() !== '');
    if (!hasContent) return;

    const saveTimer = setTimeout(async () => {
      try {
        const payload = { ...formData };
        const result = resumeId
          ? await api.updateResume(token, resumeId, payload)
          : await api.createResume(token, payload);
        setResumeId(result._id);
        setStatus('Auto-saved just now.');
      } catch (error) {
        setStatus(error.message || 'Auto-save failed.');
      }
    }, 800);

    return () => clearTimeout(saveTimer);
  }, [formData, resumeId, token]);

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
      setResumes((prev) => {
        const filtered = prev.filter((item) => item._id !== result._id);
        return [result, ...filtered].slice(0, 5);
      });
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
      const nextData = {
        ...formData,
        summary: result.summary,
        skills: result.skills
      };
      setFormData(nextData);
      skipAutoSave.current = true;
      const saved = resumeId
        ? await api.updateResume(token, resumeId, nextData)
        : await api.createResume(token, nextData);
      setResumeId(saved._id);
      setResumes((prev) => {
        const filtered = prev.filter((item) => item._id !== saved._id);
        return [saved, ...filtered].slice(0, 5);
      });
      setStatus('AI enhancement applied and saved.');
    } catch (error) {
      setStatus(error.message || 'Enhancement failed.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleExport = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${formData.name || 'Resume'}-resume`
  });

  const handleSelectResume = (resume) => {
    setResumeId(resume._id);
    setFormData({ ...EMPTY_FORM, ...resume });
    setStatus(`Loaded "${resume.name || 'Untitled'}"`);
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
          {resumes.length > 0 ? (
            <div className="resume-list">
              {resumes.map((resume) => (
                <button
                  key={resume._id}
                  type="button"
                  className="resume-pill"
                  onClick={() => handleSelectResume(resume)}
                >
                  {resume.name || 'Untitled Resume'}
                </button>
              ))}
            </div>
          ) : null}
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
          <ResumePreview data={formData} ref={previewRef} />
          <button className="button primary" type="button" onClick={handleExport}>
            Export PDF
          </button>
        </div>
      </div>
    </section>
  );
}
