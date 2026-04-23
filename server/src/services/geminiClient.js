import { parseAiResumeResponse } from './aiResponseParser.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function extractText(responseJson) {
  const parts = responseJson?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map((part) => part.text || '').join(' ').trim();
}

export async function generateWithGemini({ summary, skills, experience, projects, education }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const prompt = `You are a resume assistant. Improve the resume content for clarity and impact.

Return valid JSON only with exactly these string keys:
summary, skills, experience, projects, education

Keep each section in its own field. Do not merge sections together.
Do not ask the user for more information.
If any section already contains text, improve that text directly.
If some sections are empty, leave them empty or make conservative edits based only on the provided resume content.
Never respond with advice, questions, markdown, or explanation text outside the JSON.

Summary: ${summary || ''}
Skills: ${skills || ''}
Experience: ${experience || ''}
Projects: ${projects || ''}
Education: ${education || ''}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4
      }
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Gemini request failed');
  }

  const data = await response.json();
  const content = extractText(data);

  return parseAiResumeResponse(content, {
    summary,
    skills,
    experience,
    projects,
    education
  });
}
