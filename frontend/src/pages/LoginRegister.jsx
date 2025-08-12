import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function LoginRegister() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") await login(form);
      else await register(form);
      toast.success(mode === "login" ? "✅ Logged in" : "🎉 Registered");
    } catch (err) {
      toast.error(err.response?.error || err.message || "Authentication failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-300 bg-light px-3">
      <div
        className="card shadow-lg"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "1rem",
          padding: "2.5rem 2rem",
        }}
      >
        {/* Title */}
        <h2 className="fw-bold text-center mb-4" style={{ color: "#0d6efd" }}>
          {mode === "login" ? "Welcome Back!" : "Create an Account"}
        </h2>

        {/* Form */}
        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
              style={{ borderRadius: "0.5rem" }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{ borderRadius: "0.5rem" }}
            />
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mb-3">
            <button
              type="submit"
              className="btn btn-primary flex-grow-1 btn-lg shadow"
              style={{ borderRadius: "0.6rem", fontWeight: "600" }}
            >
              {mode === "login" ? "Log In" : "Register"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="btn btn-outline-secondary flex-grow-1 btn-lg shadow"
              style={{ borderRadius: "0.6rem", fontWeight: "600" }}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>

        {/* Toggle Info Text */}
        <p className="text-center text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            role="button"
            tabIndex={0}
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setMode(mode === "login" ? "register" : "login");
              }
            }}
            style={{ color: "#0d6efd", fontWeight: "600", cursor: "pointer" }}
          >
            {mode === "login" ? "Sign up here" : "Log in here"}
          </span>
        </p>
      </div>

      {/* Extra styles */}
      <style>{`
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        button.btn:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.5);
        }
      `}</style>
    </div>
  );
}
