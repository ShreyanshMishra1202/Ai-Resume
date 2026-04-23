const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function extractText(responseJson) {
  const parts = responseJson?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map((part) => part.text || '').join(' ').trim();
}

export async function generateWithGemini({ summary, skills }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const prompt = `You are a resume assistant. Improve the summary and skills for clarity and impact.\n\nSummary: ${summary || ''}\nSkills: ${skills || ''}\n\nReturn JSON only with keys summary and skills.`;

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

  try {
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || summary || '',
      skills: parsed.skills || skills || ''
    };
  } catch (error) {
    return {
      summary: content || summary || '',
      skills: skills || ''
    };
  }
}
