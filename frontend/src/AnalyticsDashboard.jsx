// import React, { useEffect, useState } from 'react';

// const AnalyticsDashboard = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/analytics')
//       .then(res => res.json())
//       .then(setData)
//       .catch(err => console.error('Error fetching analytics', err));
//   }, []);

//   if (!data) return <p>Loading analytics...</p>;

//   return (
//     <div>
//       <h2>📊 Analytics Dashboard</h2>
//       <p>Total Requests: {data.totalRequests}</p>
//       <p>Total Logins: {data.totalLogins}</p>
//       <h3>Route Stats:</h3>
//       <ul>
//         {Object.entries(data.routes).map(([route, count]) => (
//           <li key={route}>{route}: {count}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AnalyticsDashboard;

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