const SECTION_KEYS = ['summary', 'skills', 'experience', 'projects', 'education'];
const NEEDS_MORE_INFO_PATTERNS = [
  /please provide your current summary/i,
  /please provide/i,
  /once you provide this/i,
  /share your professional background/i,
  /brief description of your professional background/i,
  /type of role you're seeking/i
];

function sanitizeJsonText(content = '') {
  return content
    .replace(/```json\s*/gi, '')
    .replace(/```/g, '')
    .trim();
}

function tryParseJson(content) {
  const sanitized = sanitizeJsonText(content);

  try {
    return JSON.parse(sanitized);
  } catch (error) {
    const match = sanitized.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
}

function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

function flattenValue(value) {
  if (typeof value === 'string') return normalizeWhitespace(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => flattenValue(item))
      .filter(Boolean)
      .join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([title, items]) => {
        const flattenedItems = flattenValue(items);
        return flattenedItems ? `${title}: ${flattenedItems}` : '';
      })
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

function normalizeStructuredPayload(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

  const normalized = {};
  for (const key of SECTION_KEYS) {
    normalized[key] = flattenValue(parsed[key]);
  }

  return normalized;
}

function extractSectionsFromText(content) {
  const text = sanitizeJsonText(content);
  if (!text) {
    return {
      summary: '',
      skills: '',
      experience: '',
      projects: '',
      education: ''
    };
  }

  const headings = {
    summary: ['professional summary', 'summary', 'profile', 'about'],
    skills: ['technical skills', 'core competencies', 'soft skills', 'languages', 'skills'],
    experience: ['work experience', 'professional experience', 'experience', 'employment history'],
    projects: ['projects', 'project experience'],
    education: ['education', 'academic background', 'qualifications']
  };

  const headingToKey = new Map();
  Object.entries(headings).forEach(([key, aliases]) => {
    aliases.forEach((alias) => headingToKey.set(alias, key));
  });

  const headingPattern = /^(summary|professional summary|profile|about|skills|technical skills|core competencies|soft skills|languages|experience|work experience|professional experience|employment history|projects|project experience|education|academic background|qualifications)\s*:?\s*$/gim;
  const matches = [...text.matchAll(headingPattern)];

  if (matches.length === 0) {
    return {
      summary: text,
      skills: '',
      experience: '',
      projects: '',
      education: ''
    };
  }

  const extracted = {
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: ''
  };

  matches.forEach((match, index) => {
    const alias = match[1].toLowerCase();
    const key = headingToKey.get(alias);
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const block = normalizeWhitespace(text.slice(start, end));
    if (!block || !key) return;

    if (key === 'skills' && extracted.skills) {
      extracted.skills = `${extracted.skills}\n${alias}: ${block}`.trim();
      return;
    }

    extracted[key] = extracted[key]
      ? `${extracted[key]}\n${block}`.trim()
      : block;
  });

  return extracted;
}

function hasUsableInput(fallback = {}) {
  return SECTION_KEYS.some((key) => typeof fallback[key] === 'string' && fallback[key].trim().length > 0);
}

function isRequestingMoreInfo(content = '') {
  const text = sanitizeJsonText(content);
  return NEEDS_MORE_INFO_PATTERNS.some((pattern) => pattern.test(text));
}

export function parseAiResumeResponse(content, fallback = {}) {
  if (hasUsableInput(fallback) && isRequestingMoreInfo(content)) {
    return {
      summary: fallback.summary || '',
      skills: fallback.skills || '',
      experience: fallback.experience || '',
      projects: fallback.projects || '',
      education: fallback.education || ''
    };
  }

  const parsed = tryParseJson(content);
  const normalized = normalizeStructuredPayload(parsed);
  const extracted = normalized || extractSectionsFromText(content);

  return {
    summary: extracted.summary || fallback.summary || '',
    skills: extracted.skills || fallback.skills || '',
    experience: extracted.experience || fallback.experience || '',
    projects: extracted.projects || fallback.projects || '',
    education: extracted.education || fallback.education || ''
  };
}
