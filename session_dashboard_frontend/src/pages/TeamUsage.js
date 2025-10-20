// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-005
// User Story: Team usage analytics page
// GxP Impact: YES - Displays analytics data
// Risk Level: MEDIUM
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getTeamUsage } from '../services/analyticsService';
import { getDateRange } from '../utils/dateUtils';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import BarChart from '../components/charts/BarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * TeamUsage page component
 * @returns {JSX.Element} TeamUsage page
 */
const TeamUsage = () => {
  const [filters, setFilters] = useState({
    ...getDateRange('month')
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getTeamUsage(filters);
        setData(result);
      } catch (error) {
        console.error('Error fetching team usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" message="Loading team usage..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Team Usage</h1>
      </div>
      
      <div className="filters-container">
        <DateRangeFilter 
          value={filters}
          onChange={(range) => setFilters(prev => ({ ...prev, ...range }))}
        />
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <BarChart 
            data={data?.usageByTeam || []}
            xKey="team"
            yKeys={['sessions', 'users']}
            title="Usage by Team"
            height={400}
            horizontal
          />
        </div>
      </div>
    </div>
  );
};

export default TeamUsage;
