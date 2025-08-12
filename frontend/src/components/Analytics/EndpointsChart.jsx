import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const EndpointsChart = ({ endpoints }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!endpoints || endpoints.length === 0) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: endpoints.map(e => e.endpoint),
        datasets: [{
          label: 'Hits',
          data: endpoints.map(e => e.hits),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'API Endpoint Usage'
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [endpoints]);

  return (
    <div className="card">
      <canvas ref={chartRef} />
    </div>
  );
};

export default EndpointsChart;