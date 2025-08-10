const BASE = import.meta.env.VITE_API_BASE_URL ?? ''; // '' means same origin

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// generic fetch helper
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { error: text }; }
    const err = new Error('API Error');
    err.response = json;
    throw err;
  }
  // might be empty response
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return null;
}

// auth
export const register = (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const login = (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });

// employees
export const getEmployees = () => request('/api/employees', { method: 'GET' });
export const getEmployee = (id) => request(`/api/employees/${id}`, { method: 'GET' });
export const createEmployee = (payload) => request('/api/employees', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
export const updateEmployee = (id, payload) => request(`/api/employees/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
export const deleteEmployee = (id) => request(`/api/employees/${id}`, { method: 'DELETE', headers: authHeaders() });

// analytics stub (optional backend endpoint)
export const getAnalytics = () => request('/api/analytics', { method: 'GET' });