// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-003
// User Story: Feature usage analytics page
// GxP Impact: YES - Displays analytics data
// Risk Level: MEDIUM
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getFeatureUsage } from '../services/analyticsService';
import { getDateRange } from '../utils/dateUtils';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import TeamFilter from '../components/filters/TeamFilter';
import FeatureFilter from '../components/filters/FeatureFilter';
import BarChart from '../components/charts/BarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * FeatureUsage page component
 * @returns {JSX.Element} FeatureUsage page
 */
const FeatureUsage = () => {
  const [filters, setFilters] = useState({
    ...getDateRange('month'),
    teamId: '',
    featureId: ''
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getFeatureUsage(filters);
        setData(result);
      } catch (error) {
        console.error('Error fetching feature usage:', error);
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
        <LoadingSpinner size="large" message="Loading feature usage..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Feature Usage</h1>
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
        <FeatureFilter 
          value={filters.featureId}
          onChange={(val) => updateFilter('featureId', val)}
        />
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <BarChart 
            data={data?.usageByFeature || []}
            xKey="feature"
            yKeys={['usage']}
            title="Usage by Feature"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureUsage;
