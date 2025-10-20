// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-004
// User Story: Trends analysis page
// GxP Impact: YES - Displays analytics data
// Risk Level: MEDIUM
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getTrendAnalysis } from '../services/analyticsService';
import { getDateRange } from '../utils/dateUtils';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import LineChart from '../components/charts/LineChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Trends page component
 * @returns {JSX.Element} Trends page
 */
const Trends = () => {
  const [filters, setFilters] = useState({
    ...getDateRange('quarter')
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getTrendAnalysis(filters);
        setData(result);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" message="Loading trends..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Trends Analysis</h1>
      </div>
      
      <div className="filters-container">
        <DateRangeFilter 
          value={filters}
          onChange={(range) => setFilters(prev => ({ ...prev, ...range }))}
        />
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <LineChart 
            data={data?.sessionTrends || []}
            xKey="date"
            yKeys={['sessions', 'users']}
            title="Session & User Trends"
            height={400}
          />
        </div>
        
        <div className="chart-card">
          <LineChart 
            data={data?.featureTrends || []}
            xKey="date"
            yKeys={['featureUsage']}
            title="Feature Usage Trends"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Trends;
