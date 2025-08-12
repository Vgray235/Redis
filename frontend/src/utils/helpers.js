export const parseError = async (res) => {
  try {
    const j = await res.json();
    return j.error || j.message || JSON.stringify(j);
  } catch (e) {
    return `${res.status} ${res.statusText}`;
  }
};

export const validatePassword = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const getPasswordStrength = (password) => {
  const strength = ['very weak', 'weak', 'ok', 'good', 'strong'];
  return strength[Math.max(0, validatePassword(password))] || 'very weak';
};