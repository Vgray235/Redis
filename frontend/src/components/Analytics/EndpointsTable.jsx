import React from 'react';

const EndpointsTable = ({ endpoints, totalHits }) => {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Hits</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((ep, i) => {
            const pct = totalHits 
              ? ((ep.hits / totalHits) * 100).toFixed(1) 
              : 0;
            return (
              <tr key={i}>
                <td><code>{ep.endpoint}</code></td>
                <td>{ep.hits}</td>
                <td>{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EndpointsTable;