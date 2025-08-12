import React, { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
} from "../api";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [emps, setEmps] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [editing, setEditing] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getEmployees();
      setEmps(data);
    } catch {
      toast.error("Failed to load employees");
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateEmployee(editing, form);
      else await createEmployee(form);
      setForm({ name: "", email: "", department: "" });
      setEditing(null);
      await load();
      toast.success("Saved successfully");
    } catch (err) {
      toast.error(err.response?.error || "Save failed");
    }
  };

  const edit = (emp) => {
    setEditing(emp._id || emp.id);
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this employee?")) return;
    await deleteEmployee(id);
    toast.info("Employee deleted");
    load();
  };

  const showAnalytics = async () => {
    try {
      const a = await getAnalytics();
      setAnalytics(a);
    } catch {
      toast.error("Analytics load failed");
    }
  };

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-gradient mb-1">Employee Dashboard</h2>
          <p className="text-muted">Manage your team & view insights</p>
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2 shadow-sm"
            onClick={showAnalytics}
          >
            📊 Show Analytics
          </button>
          <button className="btn btn-primary shadow-sm" onClick={load}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ANALYTICS */}
      {analytics && (
        <div className="row g-4 mb-5">
          {Object.entries(analytics).map(([key, value], i) => {
            const colors = ["primary", "success", "warning", "danger"];
            const color = colors[i % colors.length];
            return (
              <div className="col-md-3" key={key}>
                <div
                  className={`card shadow border-0 text-center analytics-card h-100`}
                  style={{
                    background: `var(--bs-${color}-bg-subtle)`,
                    borderRadius: "1rem",
                  }}
                >
                  <div className="card-body py-4">
                    <h6 className="text-uppercase text-muted">{key}</h6>
                    <h2 className={`fw-bold text-${color}`}>{value}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORM */}
      <div className="card shadow border-0 mb-5" style={{ borderRadius: "1rem" }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4 text-primary">
            {editing ? "✏️ Edit Employee" : "➕ Add Employee"}
          </h5>
          <form onSubmit={submit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control shadow-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control shadow-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Department</label>
              <input
                type="text"
                className="form-control shadow-sm"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                required
              />
            </div>
            <div className="col-12 text-end mt-3">
              <button className="btn btn-success me-3 shadow-sm" type="submit">
                {editing ? "💾 Update" : "✅ Create"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary shadow-sm"
                onClick={() => {
                  setForm({ name: "", email: "", department: "" });
                  setEditing(null);
                }}
              >
                ♻️ Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="card shadow border-0" style={{ borderRadius: "1rem" }}>
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-primary">
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "25%" }}>Name</th>
                <th style={{ width: "30%" }}>Email</th>
                <th style={{ width: "20%" }}>Department</th>
                <th className="text-center" style={{ width: "20%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {emps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No employees found
                  </td>
                </tr>
              ) : (
                emps.map((e, index) => (
                  <tr key={e._id || e.id} style={{ height: "60px" }}>
                    <td className="fw-bold">{index + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>
                      <span className="badge bg-info text-dark px-3 py-2">
                        {e.department}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-warning shadow-sm px-3"
                          onClick={() => edit(e)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger shadow-sm px-3"
                          onClick={() => remove(e._id || e.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra styles */}
      <style>{`
        .text-gradient {
          background: linear-gradient(45deg, #0d6efd, #4dabf7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        table tbody tr:hover {
          background-color: #f8f9fa !important;
        }
        table thead {
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
        }
        .gap-2 > * {
          flex: none;
        }
      `}</style>
    </div>
  );
}
