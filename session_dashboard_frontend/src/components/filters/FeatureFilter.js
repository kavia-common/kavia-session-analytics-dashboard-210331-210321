// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FILTER-004
// User Story: Feature filter for analytics queries
// GxP Impact: YES - Filters affect data queries
// Risk Level: LOW
// ============================================================================

import React, { useEffect, useState } from 'react';
import { getFeatures } from '../../services/analyticsService';
import './Filters.css';

// PUBLIC_INTERFACE
/**
 * FeatureFilter component for filtering by feature
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback when feature selection changes
 * @param {string} props.value - Current selected feature ID
 * @returns {JSX.Element} FeatureFilter component
 */
const FeatureFilter = ({ onChange, value }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const data = await getFeatures();
        setFeatures(data || []);
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <div className="filter-group">
      <label className="filter-label" htmlFor="feature-filter">Feature</label>
      <select
        id="feature-filter"
        className="filter-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        <option value="">All Features</option>
        {features.map(feature => (
          <option key={feature.id} value={feature.id}>
            {feature.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FeatureFilter;
