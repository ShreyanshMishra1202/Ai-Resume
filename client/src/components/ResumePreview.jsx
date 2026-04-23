import { forwardRef } from 'react';

function sanitizeJsonText(content = '') {
  return content
    .replace(/```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

function parseJsonValue(value) {
  if (typeof value !== 'string') return value;

  const sanitized = sanitizeJsonText(value);
  if (!sanitized.startsWith('{') && !sanitized.startsWith('[')) {
    return value;
  }

  try {
    return JSON.parse(sanitized);
  } catch (error) {
    return value;
  }
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function getSummaryContent(summary) {
  const parsed = parseJsonValue(summary);

  if (parsed && typeof parsed === 'object' && typeof parsed.summary === 'string') {
    return parsed.summary;
  }

  return typeof parsed === 'string' ? parsed : '';
}

function getSkillSections(summary, skills) {
  const parsedSummary = parseJsonValue(summary);
  const parsedSkills = parseJsonValue(skills);

  const skillSource = parsedSkills && typeof parsedSkills === 'object' && !Array.isArray(parsedSkills)
    ? parsedSkills
    : parsedSummary && typeof parsedSummary === 'object' && parsedSummary.skills
      ? parsedSummary.skills
      : parsedSkills;

  if (skillSource && typeof skillSource === 'object' && !Array.isArray(skillSource)) {
    return Object.entries(skillSource)
      .map(([title, items]) => ({
        title,
        items: normalizeList(items)
      }))
      .filter((section) => section.items.length > 0);
  }

  const flatSkills = normalizeList(skillSource);
  return flatSkills.length > 0 ? [{ title: 'Skills', items: flatSkills }] : [];
}

const ResumePreview = forwardRef(function ResumePreview({ data }, ref) {
  const summaryContent = getSummaryContent(data.summary);
  const skillSections = getSkillSections(data.summary, data.skills);

  return (
    <div className="resume-preview" ref={ref}>
      <div className="resume-header">
        <h2>{data.name || 'Your Name'}</h2>
        <p>{data.email || 'email@example.com'} | {data.phone || 'Phone'}</p>
      </div>
      <div className="resume-section">
        <h4>Summary</h4>
        <p>{summaryContent || 'Write a concise professional summary.'}</p>
      </div>
      {skillSections.length > 0 ? (
        <div className="resume-section">
          <h4>Skills</h4>
          <div className="resume-skill-groups">
            {skillSections.map((section) => (
              <div key={section.title} className="resume-skill-group">
                {section.title !== 'Skills' ? <h5>{section.title}</h5> : null}
                <ul>
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="resume-section">
          <h4>Skills</h4>
          <p>Add skill keywords.</p>
        </div>
      )}
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
