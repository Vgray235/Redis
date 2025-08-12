import React from 'react';

const StatsGrid = ({ analytics }) => {
  return (
    <div className="stats-row">
      <div className="stat">
        {analytics.totalHits || 0}
        <div className="label">Total Hits</div>
      </div>
      <div className="stat">
        {analytics.totalLogins || 0}
        <div className="label">Total Logins</div>
      </div>
      <div className="stat">
        {analytics.endpoints ? analytics.endpoints.length : 0}
        <div className="label">Active Endpoints</div>
      </div>
       {analytics.rateLimit && (
        <>
          <div className="stat">
            {analytics.rateLimit.remaining} / {analytics.rateLimit.limit}
            <div className="label">Requests Left</div>
          </div>
          <div className="stat">
            {analytics.rateLimit.resetIn}s
            <div className="label">Reset In</div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsGrid;