import { generateWithGemini } from './geminiClient.js';
import { generateWithOpenAI } from './openaiClient.js';

function normalizeText(value) {
  return typeof value === 'string'
    ? value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
    : '';
}

function localEnhance({ summary, skills, experience, projects, education }, reason = '') {
  const cleanedSummary = normalizeText(summary);
  const cleanedSkills = normalizeText(skills);
  const cleanedExperience = normalizeText(experience);
  const cleanedProjects = normalizeText(projects);
  const cleanedEducation = normalizeText(education);

  return {
    summary: cleanedSummary || 'Add your professional background here.',
    skills: cleanedSkills,
    experience: cleanedExperience,
    projects: cleanedProjects,
    education: cleanedEducation,
    _meta: {
      fallbackUsed: true,
      reason
    }
  };
}

export async function enhanceResume({ summary, skills, experience, projects, education }) {
  const provider = process.env.AI_PROVIDER || 'stub';

  try {
    if (provider === 'gemini') {
      return await generateWithGemini({ summary, skills, experience, projects, education });
    }

    if (provider === 'openai') {
      return await generateWithOpenAI({ summary, skills, experience, projects, education });
    }
  } catch (error) {
    return localEnhance(
      { summary, skills, experience, projects, education },
      error.message || 'AI provider request failed'
    );
  }

  return localEnhance(
    { summary, skills, experience, projects, education },
    'AI provider is set to stub mode'
  );
}
