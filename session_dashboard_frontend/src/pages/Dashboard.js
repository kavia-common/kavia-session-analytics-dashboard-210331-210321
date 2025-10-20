// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-002
// User Story: Dashboard summary page with key metrics
// GxP Impact: YES - Displays analytics data
// Risk Level: MEDIUM
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/analyticsService';
import { getDateRange } from '../utils/dateUtils';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Dashboard page component
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = () => {
  const [filters, setFilters] = useState({
    ...getDateRange('month')
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getDashboardSummary(filters);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleDateRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      ...range
    }));
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
      
      <div className="filters-container">
        <DateRangeFilter 
          value={filters}
          onChange={handleDateRangeChange}
        />
      </div>
      
      <div className="dashboard-grid">
        <div className="metric-card">
          <h3 className="metric-label">Total Sessions</h3>
          <p className="metric-value">{data?.totalSessions || 0}</p>
        </div>
        
        <div className="metric-card">
          <h3 className="metric-label">Active Users</h3>
          <p className="metric-value">{data?.activeUsers || 0}</p>
        </div>
        
        <div className="metric-card">
          <h3 className="metric-label">Total Features Used</h3>
          <p className="metric-value">{data?.totalFeatures || 0}</p>
        </div>
        
        <div className="metric-card">
          <h3 className="metric-label">Avg Session Duration</h3>
          <p className="metric-value">{data?.avgDuration || '0m'}</p>
        </div>
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <LineChart 
            data={data?.sessionTrends || []}
            xKey="date"
            yKeys={['sessions']}
            title="Session Trends"
            height={300}
          />
        </div>
        
        <div className="chart-card">
          <PieChart 
            data={data?.featureDistribution || []}
            title="Feature Distribution"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
