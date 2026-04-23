const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-zved.onrender.com';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    throw new Error('Unable to reach the backend server.');
  }

  if (!response.ok) {
    const rawText = await response.text();

    try {
      const error = JSON.parse(rawText);
      throw new Error(error.message || 'Request failed');
    } catch (parseError) {
      throw new Error(rawText || 'Request failed');
    }
  }

  return response.json();
}

function authRequest(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
}

export const api = {
  register: (payload) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (payload) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  me: (token) => request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  listResumes: (token) => authRequest('/api/resumes', token),
  createResume: (token, payload) => authRequest('/api/resumes', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateResume: (token, id, payload) => authRequest(`/api/resumes/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  enhanceResume: (token, payload) => authRequest('/api/ai/enhance', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
