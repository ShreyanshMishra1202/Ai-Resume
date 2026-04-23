const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateWithOpenAI({ summary, skills }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const prompt = `You are a resume assistant. Improve the summary and skills for clarity and impact.\n\nSummary: ${summary || ''}\nSkills: ${skills || ''}\n\nReturn JSON only with keys summary and skills.`;

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
