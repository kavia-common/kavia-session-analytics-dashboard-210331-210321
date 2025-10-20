// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-006
// User Story: User analysis page
// GxP Impact: YES - Displays analytics data
// Risk Level: MEDIUM
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getUserAnalysis } from '../services/analyticsService';
import { getDateRange } from '../utils/dateUtils';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import TeamFilter from '../components/filters/TeamFilter';
import UserFilter from '../components/filters/UserFilter';
import BarChart from '../components/charts/BarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * UserAnalysis page component
 * @returns {JSX.Element} UserAnalysis page
 */
const UserAnalysis = () => {
  const [filters, setFilters] = useState({
    ...getDateRange('month'),
    teamId: '',
    userId: ''
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getUserAnalysis(filters);
        setData(result);
      } catch (error) {
        console.error('Error fetching user analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" message="Loading user analysis..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">User Analysis</h1>
      </div>
      
      <div className="filters-container">
        <DateRangeFilter 
          value={filters}
          onChange={(range) => setFilters(prev => ({ ...prev, ...range }))}
        />
        <TeamFilter 
          value={filters.teamId}
          onChange={(val) => updateFilter('teamId', val)}
        />
        <UserFilter 
          value={filters.userId}
          onChange={(val) => updateFilter('userId', val)}
          teamId={filters.teamId}
        />
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <BarChart 
            data={data?.usageByUser || []}
            xKey="user"
            yKeys={['sessions']}
            title="Usage by User"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default UserAnalysis;
