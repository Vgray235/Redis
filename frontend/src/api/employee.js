export async function fetchEmployees() {
  const res = await fetch('http://localhost:5000/api/employees');
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function createEmployee(data) {
  const res = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json();
}

// src/api/employees.js

// Add other API functions like createEmployee, updateEmployee, deleteEmployee as needed
