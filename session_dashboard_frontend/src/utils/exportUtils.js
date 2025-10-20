// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-UTIL-003
// User Story: Provide data export utilities for CSV and JSON
// Acceptance Criteria: 
//   - Export data to CSV format
//   - Export data to JSON format
//   - Handle special characters and formatting
// GxP Impact: YES - Exported data must maintain integrity
// Risk Level: MEDIUM
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Convert array of objects to CSV string
 * @param {Array<Object>} data - Array of data objects
 * @param {Array<string>} headers - Optional custom headers
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data, headers = null) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  try {
    // Get headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Create header row
    const headerRow = csvHeaders.join(',');
    
    // Create data rows
    const dataRows = data.map(item => {
      return csvHeaders.map(header => {
        let value = item[header];
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }
        
        // Convert to string
        value = String(value);
        
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    });
    
    return [headerRow, ...dataRows].join('\n');
  } catch (error) {
    console.error('Error converting to CSV:', error);
    throw new Error('Failed to convert data to CSV format');
  }
};

// PUBLIC_INTERFACE
/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'export.csv') => {
  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw new Error('Failed to download CSV file');
  }
};

// PUBLIC_INTERFACE
/**
 * Download JSON file
 * @param {Object|Array} data - Data to export
 * @param {string} filename - Name of the file to download
 */
export const downloadJSON = (data, filename = 'export.json') => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading JSON:', error);
    throw new Error('Failed to download JSON file');
  }
};

// PUBLIC_INTERFACE
/**
 * Prepare export data with metadata
 * @param {Array<Object>} data - Raw data
 * @param {Object} filters - Applied filters
 * @param {Object} userInfo - Current user information
 * @returns {Object} Export package with metadata
 */
export const prepareExportData = (data, filters, userInfo) => {
  return {
    metadata: {
      exportDate: new Date().toISOString(),
      exportedBy: userInfo?.username || 'Unknown',
      userId: userInfo?.id || null,
      filters: filters || {},
      recordCount: data.length
    },
    data: data
  };
};
