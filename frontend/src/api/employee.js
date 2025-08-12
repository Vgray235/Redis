export async function fetchEmployees() {
  const res = await fetch('https://redis-m04j.onrender.com/api/employees');
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


