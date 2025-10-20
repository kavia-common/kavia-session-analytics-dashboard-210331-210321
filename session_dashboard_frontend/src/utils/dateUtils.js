// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-UTIL-001
// User Story: Provide date formatting and manipulation utilities
// Acceptance Criteria: 
//   - ISO 8601 format support (GxP requirement)
//   - Date range validation
//   - User-friendly date formatting
// GxP Impact: YES - Date/time stamps are critical for audit trail (ALCOA+)
// Risk Level: MEDIUM
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Format date to ISO 8601 format (GxP compliant)
 * @param {Date|string|number} date - The date to format
 * @returns {string} ISO 8601 formatted date string
 */
export const formatISODate = (date) => {
  try {
    return new Date(date).toISOString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return null;
  }
};

// PUBLIC_INTERFACE
/**
 * Format date for display (user-friendly)
 * @param {Date|string|number} date - The date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date, includeTime = false) => {
  try {
    const d = new Date(date);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
    }
    
    return d.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Invalid Date';
  }
};

// PUBLIC_INTERFACE
/**
 * Get date range for common periods
 * @param {string} period - 'today', 'week', 'month', 'quarter', 'year'
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRange = (period) => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1);
  }
  
  return {
    startDate: formatISODate(startDate),
    endDate: formatISODate(endDate)
  };
};

// PUBLIC_INTERFACE
/**
 * Validate date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {Object} Validation result with isValid and error message
 */
export const validateDateRange = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime())) {
      return { isValid: false, error: 'Invalid start date' };
    }
    
    if (isNaN(end.getTime())) {
      return { isValid: false, error: 'Invalid end date' };
    }
    
    if (start > end) {
      return { isValid: false, error: 'Start date must be before end date' };
    }
    
    // Check if range is too large (e.g., > 2 years)
    const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
    if (daysDiff > 730) {
      return { isValid: false, error: 'Date range cannot exceed 2 years' };
    }
    
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: 'Invalid date format' };
  }
};
