import React, { useEffect, useState } from "react";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getAnalytics } from "../api";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [emps, setEmps] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [editing, setEditing] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(()=>{ load(); }, []);

  async function load() {
    try {
      const data = await getEmployees();
      setEmps(data);
    } catch { toast.error("Load failed"); }
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateEmployee(editing, form);
      else await createEmployee(form);
      setForm({ name: "", email: "", department: "" });
      setEditing(null);
      await load();
      toast.success("Saved");
    } catch (err) { toast.error(err.response?.error || "Save failed"); }
  };

  const edit = (emp) => { setEditing(emp._id || emp.id); setForm({ name: emp.name, email: emp.email, department: emp.department }); };
  const remove = async (id) => { if (!confirm("Delete?")) return; await deleteEmployee(id); toast.info("Deleted"); load(); };

  const showAnalytics = async () => {
    try { const a = await getAnalytics(); setAnalytics(a); } catch { toast.error("Analytics failed"); }
  };

  return (
    <>
      <div className="card p-3 mb-3">
        <form onSubmit={submit} className="row g-2">
          <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Department" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} /></div>
          <div className="col-12 text-end mt-2">
            <button className="btn btn-primary me-2" type="submit">{editing?"Update":"Create"}</button>
            <button className="btn btn-outline-secondary" type="button" onClick={()=>{ setForm({name:"",email:"",department:""}); setEditing(null); }}>Reset</button>
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-secondary" onClick={load}>Refresh</button>
        <button className="btn btn-outline-dark" onClick={showAnalytics}>Show Analytics</button>
      </div>

      {analytics && <div className="alert alert-light">Analytics: {JSON.stringify(analytics)}</div>}

      <table className="table table-striped">
        <thead className="table-dark"><tr><th>_id</th><th>Name</th><th>Email</th><th>Dept</th><th>Actions</th></tr></thead>
        <tbody>
          {emps.length===0 ? <tr><td colSpan="5">No employees</td></tr> : emps.map(e=>(
            <tr key={e._id || e.id}>
              <td style={{maxWidth:260, wordBreak:"break-all"}}>{e._id || e.id}</td>
              <td>{e.name}</td><td>{e.email}</td><td>{e.department}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={()=>edit(e)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>remove(e._id || e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}