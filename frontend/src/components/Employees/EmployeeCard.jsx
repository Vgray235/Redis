import React from 'react';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="card emp-card">
      <div className="emp-name">{employee.name}</div>
      <div className="emp-pos">{employee.position}</div>
      <div className="emp-sal">${employee.salary.toLocaleString()}</div>
      <div className="card-actions">
        <button onClick={onEdit} className="btn">
          Edit
        </button>
        <button onClick={onDelete} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;