import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { parseError } from '../utils/helpers';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const useApi = () => {
  const { token, logout } = useAuth();
  const { addToast } = useToast();

  const raw = useCallback(async (path, opts = {}) => {
    const headers = opts.headers || {};
    
    if (!(opts.body instanceof FormData)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

    if (res.status === 401) {
      addToast('Session expired. Redirecting to login.', 'error');
      logout();
      throw new Error('401');
    }

    if (res.status === 429) {
      let retryAfter = res.headers.get('Retry-After') || '';
      try {
        const body = await res.json();
        if (body.retryAfter) retryAfter = body.retryAfter;
      } catch (e) {}
      addToast(`Rate limit exceeded. Try again in ${retryAfter || 'a few'} seconds.`, 'error');
      const err = new Error('429');
      err.retryAfter = retryAfter;
      throw err;
    }

    if (!res.ok) {
      const msg = await parseError(res);
      throw new Error(msg);
    }

    try { 
      return await res.json(); 
    } catch (e) { 
      return null; 
    }
  }, [token, logout, addToast]);

  return { raw };
};
