const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || res.statusText);
    err.response = data;
    throw err;
  }
  return data;
}

/* Auth */
export const register = (payload) => req("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const login = (payload) => req("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
export const logout = () => req("/api/auth/logout", { method: "POST" });
export const getSession = () => req("/api/auth/session", { method: "GET" });

/* Employees */
export const getEmployees = () => req("/api/employees", { method: "GET" });
export const getEmployee = (id) => req(`/api/employees/${id}`, { method: "GET" });
export const createEmployee = (payload) => req("/api/employees", { method: "POST", body: JSON.stringify(payload) });
export const updateEmployee = (id, payload) => req(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteEmployee = (id) => req(`/api/employees/${id}`, { method: "DELETE" });

/* Analytics */
export const getAnalytics = () => req("/api/analytics", { method: "GET" });