import { generateWithOpenAI } from './openaiClient.js';

export async function enhanceResume({ summary, skills }) {
  const provider = process.env.AI_PROVIDER || 'stub';

  if (provider === 'openai') {
    return generateWithOpenAI({ summary, skills });
  }

  const enhancedSummary = summary?.trim()
    ? `${summary.trim()} (enhanced)`
    : 'Professional summary enhanced by AI.';

  const enhancedSkills = skills?.trim()
    ? `${skills.trim()}, AI-optimized`
    : 'AI-optimized skills';

  return { summary: enhancedSummary, skills: enhancedSkills };
}
