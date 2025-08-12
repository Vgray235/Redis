import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Navbar = ({ currentView, setCurrentView }) => {
  const { logout, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out', 'success');
    } catch (e) {
      addToast('Logout failed', 'error');
    }
  };

  return (
    <header className="nav">
      <div className="brand">EmployeeMgmt</div>
      <nav className="nav-links">
        <button
          className={currentView === 'employees' ? 'active' : ''}
          onClick={() => setCurrentView('employees')}
        >
          Employees
        </button>
        <button
          className={currentView === 'analytics' ? 'active' : ''}
          onClick={() => setCurrentView('analytics')}
        >
          Analytics
        </button>
        {isAuthenticated && (
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;