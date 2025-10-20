// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-008
// User Story: Audit trail page for GxP compliance
// GxP Impact: YES - Critical for compliance
// Risk Level: HIGH
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getAuditTrail } from '../services/analyticsService';
import { getDateRange, formatDisplayDate } from '../utils/dateUtils';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * AuditTrail page component
 * @returns {JSX.Element} AuditTrail page
 */
const AuditTrail = () => {
  const [filters, setFilters] = useState({
    ...getDateRange('week')
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAuditTrail(filters);
        setData(result?.entries || []);
      } catch (error) {
        console.error('Error fetching audit trail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" message="Loading audit trail..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Audit Trail</h1>
        <p className="page-description">Complete audit log of all system actions</p>
      </div>
      
      <div className="filters-container">
        <DateRangeFilter 
          value={filters}
          onChange={(range) => setFilters(prev => ({ ...prev, ...range }))}
        />
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{formatDisplayDate(entry.timestamp, true)}</td>
                <td>{entry.username}</td>
                <td><span className={`badge badge-${entry.actionType?.toLowerCase()}`}>{entry.actionType}</span></td>
                <td>{entry.resource}</td>
                <td className="details-cell">{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="empty-state">
            <p>No audit trail entries found for the selected date range.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
