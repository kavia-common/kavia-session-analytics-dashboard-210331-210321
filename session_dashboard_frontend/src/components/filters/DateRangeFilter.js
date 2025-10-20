// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FILTER-001
// User Story: Date range filter for analytics queries
// Acceptance Criteria: 
//   - Preset ranges (today, week, month, quarter, year)
//   - Custom date range selection
//   - Validation
// GxP Impact: YES - Filters affect data queries for audit trail
// Risk Level: MEDIUM
// ============================================================================

import React, { useState } from 'react';
import { getDateRange, validateDateRange } from '../../utils/dateUtils';
import './Filters.css';

// PUBLIC_INTERFACE
/**
 * DateRangeFilter component for date filtering
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback when date range changes
 * @param {Object} props.value - Current date range {startDate, endDate}
 * @returns {JSX.Element} DateRangeFilter component
 */
const DateRangeFilter = ({ onChange, value }) => {
  const [error, setError] = useState(null);
  const [customMode, setCustomMode] = useState(false);

  const handlePresetChange = (preset) => {
    setCustomMode(false);
    setError(null);
    const range = getDateRange(preset);
    onChange(range);
  };

  const handleCustomDateChange = (field, value) => {
    const newRange = {
      startDate: field === 'startDate' ? value : (value?.startDate || ''),
      endDate: field === 'endDate' ? value : (value?.endDate || '')
    };
    
    if (newRange.startDate && newRange.endDate) {
      const validation = validateDateRange(newRange.startDate, newRange.endDate);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }
      setError(null);
    }
    
    onChange(newRange);
  };

  return (
    <div className="filter-group">
      <label className="filter-label">Date Range</label>
      
      <div className="filter-buttons">
        <button
          className={`filter-preset-btn ${!customMode ? 'active' : ''}`}
          onClick={() => handlePresetChange('week')}
        >
          Last Week
        </button>
        <button
          className={`filter-preset-btn ${!customMode ? 'active' : ''}`}
          onClick={() => handlePresetChange('month')}
        >
          Last Month
        </button>
        <button
          className={`filter-preset-btn ${!customMode ? 'active' : ''}`}
          onClick={() => handlePresetChange('quarter')}
        >
          Last Quarter
        </button>
        <button
          className={`filter-preset-btn ${customMode ? 'active' : ''}`}
          onClick={() => setCustomMode(true)}
        >
          Custom
        </button>
      </div>
      
      {customMode && (
        <div className="custom-date-inputs">
          <input
            type="date"
            className="filter-input"
            value={value?.startDate?.split('T')[0] || ''}
            onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            className="filter-input"
            value={value?.endDate?.split('T')[0] || ''}
            onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
          />
        </div>
      )}
      
      {error && <span className="filter-error">{error}</span>}
    </div>
  );
};

export default DateRangeFilter;
