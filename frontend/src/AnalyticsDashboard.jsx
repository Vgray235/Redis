

import React, { useEffect, useState } from "react";
import { getAnalytics } from "./services/api";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics().then(res => setData(res.data)).catch(() => {});
  }, []);
  if (!data) return null;
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Analytics</h5>
        <p>Total Requests: {data.totalRequests}</p>
        <p>Total Logins: {data.logins ?? data.totalLogins}</p>
        <p>Employees Created: {data.employeesCreated ?? data.createdCount}</p>
      </div>
    </div>
  );
}