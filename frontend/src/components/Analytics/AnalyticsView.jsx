import React, { useState, useEffect, useCallback, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';
import StatsGrid from './StatsGrid';
import EndpointsChart from './EndpointsChart';
import EndpointsTable from './EndpointsTable';

const AnalyticsView = () => {
  const { raw } = useApi();
  const { addToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await raw('/analytics');
      setAnalytics(data);
    } catch (e) {
      addToast(e.message || 'Failed to fetch analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [raw, addToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <div className="loader">Loading analytics...</div>;
  if (!analytics) return <div className="container"><p>No analytics</p></div>;

  return (
    <div className="container">
      <div className="header-row">
        <h1>Analytics</h1>
        <button className="btn" onClick={fetchAnalytics}>
          Refresh
        </button>
      </div>
      
      <StatsGrid analytics={analytics} />
      
      {analytics.endpoints && (
        <>
          <EndpointsChart endpoints={analytics.endpoints} />
          <EndpointsTable endpoints={analytics.endpoints} totalHits={analytics.totalHits} />
        </>
      )}
    </div>
  );
};

export default AnalyticsView;