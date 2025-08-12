import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseError } from '../utils/helpers';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => (token ? { token } : null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser({ token });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const msg = await parseError(res);
        return { success: false, message: msg, status: res.status };
      }
      
      const data = await res.json();
      setToken(data.token);
      return { success: true, message: data.message };
    } catch (e) {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!res.ok) {
        const msg = await parseError(res);
        return { success: false, message: msg, status: res.status };
      }
      
      const data = await res.json();
      setToken(data.token);
      return { success: true, message: data.message };
    } catch (e) {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!token) {
      setToken(null);
      return;
    }
    
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.warn('Logout call failed', e);
    } finally {
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};