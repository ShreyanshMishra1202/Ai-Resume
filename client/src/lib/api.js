const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
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
