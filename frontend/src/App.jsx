

// frontend/src/App.js

// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import {
//   getEmployees,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
//   getAnalytics,
// } from "./api";

// export default function App() {
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({ name: "", email: "", department: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [searchId, setSearchId] = useState("");
//   const [analytics, setAnalytics] = useState(null);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   async function fetchEmployees() {
//     try {
//       const res = await getEmployees();
//       setEmployees(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch employees");
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name || !form.email || !form.department) {
//       return toast.warning("Please fill all fields");
//     }
//     try {
//       if (editingId) {
//         await updateEmployee(editingId, form);
//         toast.success("Employee updated");
//       } else {
//         await createEmployee(form);
//         toast.success("Employee created");
//       }
//       setForm({ name: "", email: "", department: "" });
//       setEditingId(null);
//       fetchEmployees();
//     } catch (err) {
//       const msg = err.response?.data?.error || "Save failed";
//       toast.error(msg);
//     }
//   };

//   const handleEdit = (emp) => {
//     setEditingId(emp._id);
//     setForm({ name: emp.name, email: emp.email, department: emp.department });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this employee?")) return;
//     try {
//       await deleteEmployee(id);
//       toast.info("Employee deleted");
//       fetchEmployees();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchId) return fetchEmployees();
//     try {
//       const res = await getEmployees(); // fallback: fetch all then find id client-side
//       const found = res.data.find(e => e._id === searchId);
//       if (found) setEmployees([found]);
//       else toast.warning("Employee not found");
//     } catch {
//       toast.error("Search failed");
//     }
//   };

//   const handleAnalytics = async () => {
//     try {
//       const res = await getAnalytics();
//       setAnalytics(res.data);
//       toast.success("Analytics loaded");
//     } catch {
//       toast.error("Failed to fetch analytics");
//     }
//   };

//   return (
//     <div className="container py-4">
//       <ToastContainer position="top-right" autoClose={2500} />
//       <h2 className="text-center mb-4">Employee Management System </h2>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <form onSubmit={handleSubmit} className="row g-3">
//             <div className="col-md-4">
//               <input
//                 className="form-control"
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />
//             </div>
//             <div className="col-md-4">
//               <input
//                 className="form-control"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//               />
//             </div>
//             <div className="col-md-4">
//               <input
//                 className="form-control"
//                 placeholder="Department"
//                 value={form.department}
//                 onChange={(e) => setForm({ ...form, department: e.target.value })}
//               />
//             </div>
//             <div className="col-12 text-end">
//               <button className={`btn ${editingId ? "btn-warning" : "btn-primary"} me-2`} type="submit">
//                 {editingId ? "Update" : "Create"}
//               </button>
//               <button
//                 className="btn btn-outline-secondary"
//                 type="button"
//                 onClick={() => {
//                   setForm({ name: "", email: "", department: "" });
//                   setEditingId(null);
//                 }}
//               >
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="row mb-3 g-2">
//         <div className="col-md-4">
//           <div className="input-group">
//             <input
//               className="form-control"
//               placeholder="Search by ID"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//             />
//             <button className="btn btn-info" onClick={handleSearch}>
//               Search
//             </button>
//           </div>
//         </div>
//         <div className="col-md-8 text-end">
//           <button className="btn btn-secondary me-2" onClick={fetchEmployees}>Refresh</button>
//           <button className="btn btn-outline-dark" onClick={handleAnalytics}>Analytics</button>
//         </div>
//       </div>

//       {analytics && (
//         <div className="alert alert-light">
//           <strong>Analytics:</strong> Requests: {analytics.totalRequests ?? analytics.totalRequests}, Logins: {analytics.logins ?? analytics.totalLogins}, Employees Created: {analytics.employeesCreated ?? analytics.createdCount}
//         </div>
//       )}

//       <div className="table-responsive">
//         <table className="table table-hover align-middle">
//           <thead className="table-dark">
//             <tr>
//               <th style={{ width: "25%" }}>_id</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Department</th>
//               <th style={{ width: 150 }} className="text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.length === 0 ? (
//               <tr><td colSpan="5" className="text-center">No employees</td></tr>
//             ) : employees.map(emp => (
//               <tr key={emp._id}>
//                 <td style={{ maxWidth: 350, wordBreak: "break-all" }}>{emp._id}</td>
//                 <td>{emp.name}</td>
//                 <td>{emp.email}</td>
//                 <td>{emp.department}</td>
//                 <td className="text-center">
//                   <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(emp)}>Edit</button>
//                   <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import {
//   getEmployees, createEmployee, updateEmployee, deleteEmployee,
//   register as apiRegister, login as apiLogin, getAnalytics
// } from './services/api';
// import { AuthProvider, useAuth } from './context/AuthContext';

// function AuthPanel() {
//   const { user, login, register, logout } = useAuth();
//   const [form, setForm] = useState({ name: '', email: '', password: '' });

//   const handleRegister = async () => {
//     try {
//       const res = await register({ name: form.name, email: form.email, password: form.password });
//       // apiRegister sets localStorage via context
//       toast.success('Registered and logged in');
//     } catch (err) {
//       toast.error(err.response?.error || 'Register failed');
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const res = await login({ email: form.email, password: form.password });
//       // store token is handled by context via /api wrapper
//       const token = res.token;
//       // token already stored by api wrapper? Actually context's login expects apiLogin call, we are using it
//       localStorage.setItem('token', token);
//       toast.success('Logged in');
//     } catch (err) {
//       toast.error(err.response?.error || 'Login failed');
//     }
//   };

//   return (
//     <div className="card p-3 mb-3">
//       <h5>{user ? `Logged in as ${user.name}` : 'Auth'}</h5>
//       {!user ? (
//         <>
//           <input className="form-control mb-2" placeholder="Name (register)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//           <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
//           <input className="form-control mb-2" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
//           <div>
//             <button className="btn btn-outline-primary me-2" onClick={handleRegister}>Register</button>
//             <button className="btn btn-primary" onClick={handleLogin}>Login</button>
//           </div>
//         </>
//       ) : (
//         <div>
//           <button className="btn btn-secondary" onClick={() => { logout(); toast.info('Logged out'); }}>Logout</button>
//         </div>
//       )}
//     </div>
//   );
// }

// function EmployeePanel() {
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({ name:'', email:'', department:'' });
//   const [editingId, setEditingId] = useState(null);
//   const [analytics, setAnalytics] = useState(null);

//   useEffect(() => { load(); }, []);

//   async function load() {
//     try {
//       const data = await getEmployees();
//       setEmployees(data);
//     } catch (err) {
//       toast.error('Failed to load employees');
//     }
//   }

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) await updateEmployee(editingId, form);
//       else await createEmployee(form);
//       setForm({ name:'', email:'', department:'' });
//       setEditingId(null);
//       load();
//       toast.success('Saved');
//     } catch (err) {
//       toast.error(err.response?.error || 'Save failed');
//     }
//   };

//   const edit = (emp) => {
//     setEditingId(emp._id);
//     setForm({ name: emp.name, email: emp.email, department: emp.department });
//   };

//   const del = async (id) => {
//     if (!window.confirm('Delete?')) return;
//     try {
//       await deleteEmployee(id);
//       toast.info('Deleted');
//       load();
//     } catch (err) {
//       toast.error('Delete failed');
//     }
//   };

//   const loadAnalytics = async () => {
//     try {
//       const a = await getAnalytics();
//       setAnalytics(a);
//     } catch {
//       toast.error('Analytics not available');
//     }
//   };

//   return (
//     <>
//       <div className="card mb-3 p-3">
//         <form onSubmit={submit} className="row g-2">
//           <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} /></div>
//           <div className="col-md-4"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} /></div>
//           <div className="col-md-4"><input className="form-control" placeholder="Department" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} /></div>
//           <div className="col-12 text-end mt-2">
//             <button className="btn btn-primary me-2" type="submit">{editingId ? 'Update' : 'Create'}</button>
//             <button className="btn btn-outline-secondary" type="button" onClick={()=>{ setForm({name:'',email:'',department:''}); setEditingId(null); }}>Reset</button>
//           </div>
//         </form>
//       </div>

//       <div className="mb-3 d-flex justify-content-between">
//         <button className="btn btn-secondary" onClick={load}>Refresh</button>
//         <button className="btn btn-outline-dark" onClick={loadAnalytics}>Analytics</button>
//       </div>

//       {analytics && <div className="alert alert-light">Analytics: {JSON.stringify(analytics)}</div>}

//       <div className="table-responsive">
//         <table className="table table-striped">
//           <thead className="table-dark">
//             <tr><th>_id</th><th>Name</th><th>Email</th><th>Dept</th><th>Actions</th></tr>
//           </thead>
//           <tbody>
//             {employees.length===0 ? <tr><td colSpan="5">No employees</td></tr> : employees.map(e=>(
//               <tr key={e._id}>
//                 <td style={{maxWidth:300, wordBreak:'break-all'}}>{e._id}</td>
//                 <td>{e.name}</td>
//                 <td>{e.email}</td>
//                 <td>{e.department}</td>
//                 <td>
//                   <button className="btn btn-sm btn-warning me-2" onClick={()=>edit(e)}>Edit</button>
//                   <button className="btn btn-sm btn-danger" onClick={()=>del(e._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

// export default function RootApp(){
//   return (
//     <AuthProvider>
//       <div className="container py-4">
//         <ToastContainer position="top-right" />
//         <h2 className="mb-3">Employee Manager</h2>
//         <div className="row">
//           <div className="col-md-4">
//             <AuthPanel />
//           </div>
//           <div className="col-md-8">
//             <EmployeePanel />
//           </div>
//         </div>
//       </div>
//     </AuthProvider>
//   );
// }

import React from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginRegister from "./pages/LoginRegister.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function Main() {
  const { user, loading, logout } = useAuth();
  if (loading) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employee Manager</h2>
        <div>
          {user ? (
            <>
              <span className="me-3">Hello, {user.username}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">{user ? null : <LoginRegister />}</div>
        <div className="col-md-8">{user ? <Dashboard /> : <div className="alert alert-info">Please login or register</div>}</div>
      </div>
    </div>
  );
}

export default function App() {
  return <AuthProvider><Main /></AuthProvider>;
}