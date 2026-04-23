import { parseAiResumeResponse } from './aiResponseParser.js';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateWithOpenAI({ summary, skills, experience, projects, education }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

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

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'OpenAI request failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  return parseAiResumeResponse(content, {
    summary,
    skills,
    experience,
    projects,
    education
  });
}
