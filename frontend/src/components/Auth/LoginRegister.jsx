import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getPasswordStrength } from '../../utils/helpers';

const LoginRegister = ({ onAuthenticated }) => {
  const { login, register, loading } = useAuth();
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      addToast('Email and password required', 'error');
      return;
    }
    
    if (!isLogin && (!form.name || form.password.length < 6)) {
      addToast('Name required and password must be at least 6 characters', 'error');
      return;
    }

    const fn = isLogin ? login : register;
    const payload = isLogin 
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };
    
    const result = await fn(payload);
    
    if (result.success) {
      addToast(result.message || (isLogin ? 'Logged in' : 'Registered'), 'success');
      onAuthenticated?.();
    } else {
      addToast(result.message || 'Authentication failed', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Sign in' : 'Create account'}</h2>
        
        {!isLogin && (
          <div className="form-row">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        
        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
          {!isLogin && form.password && (
            <small>Password strength: {getPasswordStrength(form.password)}</small>
          )}
        </div>
        
        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Working...' : (isLogin ? 'Sign in' : 'Register')}
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create account' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginRegister;