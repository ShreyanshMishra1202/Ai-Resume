import { forwardRef } from 'react';

const ResumePreview = forwardRef(function ResumePreview({ data }, ref) {
  return (
    <div className="resume-preview" ref={ref}>
      <div className="resume-header">
        <h2>{data.name || 'Your Name'}</h2>
        <p>{data.email || 'email@example.com'} • {data.phone || 'Phone'}</p>
      </div>
      <div className="resume-section">
        <h4>Summary</h4>
        <p>{data.summary || 'Write a concise professional summary.'}</p>
      </div>
      <div className="resume-section">
        <h4>Skills</h4>
        <p>{data.skills || 'Add skill keywords.'}</p>
      </div>
      <div className="resume-section">
        <h4>Experience</h4>
        <p>{data.experience || 'Outline your most impactful experience.'}</p>
      </div>
      <div className="resume-section">
        <h4>Projects</h4>
        <p>{data.projects || 'Showcase the projects you are proud of.'}</p>
      </div>
      <div className="resume-section">
        <h4>Education</h4>
        <p>{data.education || 'Include your latest education details.'}</p>
      </div>
    </div>
  );
});

export default ResumePreview;
