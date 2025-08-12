import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';
import EmployeeFormModal from './EmployeeFormModal';
import EmployeeCard from './EmployeeCard';
import EmployeeEvents from './EmployeeEvents'; // ✅ Import SSE component

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const EmployeesView = () => {
  const { raw } = useApi();
  const { addToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await raw('/employees');
      setEmployees(data.employees || []);
      setSource(data.source || '');
    } catch (e) {
      if (e.message === '401') return; // handled by useApi
      addToast(e.message || 'Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [raw, addToast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (payload) => {
    if (editing) {
      try {
        await raw(`/employees/${editing._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        addToast('Employee updated', 'success');
        setEditing(null);
        fetchEmployees();
      } catch (e) {
        addToast(e.message || 'Update failed', 'error');
      }
    } else {
      try {
        await raw('/employees', { method: 'POST', body: JSON.stringify(payload) });
        addToast('Employee created', 'success');
        fetchEmployees();
      } catch (e) {
        addToast(e.message || 'Create failed', 'error');
      }
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}?`)) return;
    try {
      await raw(`/employees/${emp._id}`, { method: 'DELETE' });
      addToast('Employee deleted', 'success');
      fetchEmployees();
    } catch (e) {
      addToast(e.message || 'Delete failed', 'error');
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const filtered = employees.filter(emp =>
    (emp.name + emp.position).toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container">
      {/* 🔊 Mount SSE listener here */}
      <EmployeeEvents onNewEmployee={fetchEmployees} />

      <div className="header-row">
        <h1>Employees</h1>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="meta-row">
        Data source: <strong>{source || 'unknown'}</strong>
      </div>

      <EmployeeFormModal
        initial={editing}
        onCancel={() => setEditing(null)}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="grid">
          {shown.map(emp => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              onEdit={() => setEditing(emp)}
              onDelete={() => handleDelete(emp)}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page} / {pages}</span>
        <button
          onClick={() => setPage(Math.min(pages, page + 1))}
          disabled={page === pages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeesView;
