import React from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginRegister from "./pages/LoginRegister.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function Main() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="min-vh-100 bg-light d-flex flex-column">
        {/* Use container-fluid for full width */}
        <div className="container-fluid py-4 flex-grow-0 px-4">
          <header className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 fw-bold text-primary m-0">Employee Manager</h1>
            {user && (
              <div className="d-flex align-items-center gap-3">
                <span className="text-secondary fw-semibold">Hello, {user.username}</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={logout}
                  aria-label="Logout"
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </header>
        </div>

        <main className="container-fluid flex-grow-1 d-flex justify-content-center align-items-start py-4 px-4">
          <div className="row w-100 g-4">
            {!user && (
              <div className="col-12 col-md-4 d-flex justify-content-center">
                <LoginRegister />
              </div>
            )}

            <div className={`col-12 ${user ? "col-md-12" : "col-md-8"}`}>
              {user ? (
                <Dashboard />
              ) : (
                <div
                  className="alert alert-info text-center fs-5 mx-auto"
                  role="alert"
                  style={{ maxWidth: "600px" }}
                >
                  Please <strong>login</strong> or <strong>register</strong> to manage employees.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
