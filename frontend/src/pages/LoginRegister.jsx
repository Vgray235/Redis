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
      toast.success(mode === "login" ? "Logged in" : "Registered");
    } catch (err) {
      toast.error(err.response?.error || err.message || "Auth failed");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{mode === "login" ? "Login" : "Register"}</h5>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} />
        <input className="form-control mb-2" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
        <div className="d-flex">
          <button className="btn btn-primary me-2" type="submit">{mode==="login"?"Login":"Register"}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>setMode(mode==="login"?"register":"login")}>Switch</button>
        </div>
      </form>
    </div>
  );
}