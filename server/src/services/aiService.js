import { generateWithGemini } from './geminiClient.js';
import { generateWithOpenAI } from './openaiClient.js';

export async function enhanceResume({ summary, skills, experience, projects, education }) {
  const provider = process.env.AI_PROVIDER || 'stub';

  if (provider === 'gemini') {
    return generateWithGemini({ summary, skills, experience, projects, education });
  }

  if (provider === 'openai') {
    return generateWithOpenAI({ summary, skills, experience, projects, education });
  }

  const enhancedSummary = summary?.trim()
    ? `${summary.trim()} (enhanced)`
    : 'Professional summary enhanced by AI.';

  const enhancedSkills = skills?.trim()
    ? `${skills.trim()}, AI-optimized`
    : 'AI-optimized skills';

  return {
    summary: enhancedSummary,
    skills: enhancedSkills,
    experience: experience?.trim() || '',
    projects: projects?.trim() || '',
    education: education?.trim() || ''
  };
}
