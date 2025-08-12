import React, { useState } from 'react';

const EmployeeFormModal = ({ initial = null, onCancel, onSubmit }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    position: initial?.position || '',
    salary: initial?.salary || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.position || form.salary === '') return;
    onSubmit({ ...form, salary: Number(form.salary) });
    // Reset form after create (not edit)
    if (!initial) {
      setForm({ name: '', position: '', salary: '' });
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="form-card">
      <h3 className="form-title">{initial ? 'Edit Employee' : 'Add Employee'}</h3>
      <form onSubmit={handleSubmit} className="form-layout">
        
        <div className="form-group">
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Position</label>
          <input
            value={form.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            value={form.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            required
            min="0"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" type="submit">
            {initial ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormModal;
