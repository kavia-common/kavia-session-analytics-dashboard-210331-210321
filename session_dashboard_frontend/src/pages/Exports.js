// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-007
// User Story: Data export page with CSV/JSON options
// GxP Impact: YES - Data export with signature
// Risk Level: HIGH
// ============================================================================

import React, { useState } from 'react';
import { exportToCSV, exportToJSON, exportWithSignature } from '../services/analyticsService';
import { useAuth } from '../contexts/AuthContext';
import { getDateRange } from '../utils/dateUtils';
import { validateSignature } from '../utils/validators';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/Toast';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * Exports page component
 * @returns {JSX.Element} Exports page
 */
const Exports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [filters, setFilters] = useState({
    ...getDateRange('month')
  });
  const [loading, setLoading] = useState(false);
  const [signatureModal, setSignatureModal] = useState(false);
  const [signature, setSignature] = useState('');
  const [signatureError, setSignatureError] = useState('');

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      await exportToCSV(filters);
      showToast('CSV export successful', 'success');
    } catch (error) {
      showToast(error.message || 'Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setLoading(true);
      await exportToJSON(filters);
      showToast('JSON export successful', 'success');
    } catch (error) {
      showToast(error.message || 'Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignedExport = () => {
    setSignatureModal(true);
    setSignature('');
    setSignatureError('');
  };

  const handleSignatureSubmit = async () => {
    const validation = validateSignature(signature, user?.username || '');
    if (!validation.isValid) {
      setSignatureError(validation.error);
      return;
    }

    try {
      setLoading(true);
      await exportWithSignature({
        ...filters,
        signature,
        username: user?.username
      });
      showToast('Signed export successful', 'success');
      setSignatureModal(false);
    } catch (error) {
      showToast(error.message || 'Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Data Exports</h1>
        <p className="page-description">Export analytics data in various formats</p>
      </div>
      
      <div className="filters-container">
        <DateRangeFilter 
          value={filters}
          onChange={(range) => setFilters(prev => ({ ...prev, ...range }))}
        />
      </div>
      
      <div className="export-options">
        <div className="export-card">
          <h3 className="export-title">CSV Export</h3>
          <p className="export-description">Export data as CSV file for spreadsheet analysis</p>
          <button 
            className="btn btn-primary"
            onClick={handleExportCSV}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Export CSV'}
          </button>
        </div>
        
        <div className="export-card">
          <h3 className="export-title">JSON Export</h3>
          <p className="export-description">Export data as JSON file for programmatic use</p>
          <button 
            className="btn btn-primary"
            onClick={handleExportJSON}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Export JSON'}
          </button>
        </div>
        
        <div className="export-card">
          <h3 className="export-title">Signed Export</h3>
          <p className="export-description">Export with electronic signature for GxP compliance</p>
          <button 
            className="btn btn-primary"
            onClick={handleSignedExport}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Export with Signature'}
          </button>
        </div>
      </div>
      
      <Modal
        isOpen={signatureModal}
        onClose={() => setSignatureModal(false)}
        title="Electronic Signature Required"
        size="small"
      >
        <div className="signature-modal">
          <p className="signature-instruction">
            Please enter your username to confirm this export action.
          </p>
          <div className="form-group">
            <label htmlFor="signature" className="form-label">
              Your Username: <strong>{user?.username}</strong>
            </label>
            <input
              type="text"
              id="signature"
              className={`form-input ${signatureError ? 'error' : ''}`}
              value={signature}
              onChange={(e) => {
                setSignature(e.target.value);
                setSignatureError('');
              }}
              placeholder="Enter your username"
              autoComplete="off"
            />
            {signatureError && (
              <span className="form-error">{signatureError}</span>
            )}
          </div>
          <div className="modal-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setSignatureModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSignatureSubmit}
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : 'Confirm & Export'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Exports;
