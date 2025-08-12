import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import LoginRegister from './components/Auth/LoginRegister';
import EmployeesView from './components/Employees/EmployeesView';
import AnalyticsView from './components/Analytics/AnalyticsView';
import './styles.css';

function App() {
  const [view, setView] = useState('employees');
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      <Navbar currentView={view} setCurrentView={setView} />
      {!isAuthenticated ? (
        <LoginRegister onAuthenticated={() => setView('employees')} />
      ) : (
        <div className="main">
          {view === 'employees' && <EmployeesView />}
          {view === 'analytics' && <AnalyticsView />}
        </div>
      )}
    </div>
  );
}

function AppWithProviders() {
  return (
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  );
}

export default AppWithProviders;