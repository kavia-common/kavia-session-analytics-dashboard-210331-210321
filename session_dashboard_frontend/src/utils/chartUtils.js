// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-UTIL-002
// User Story: Provide chart data formatting and color utilities
// Acceptance Criteria: 
//   - Format data for various chart types
//   - Consistent color palette
// GxP Impact: NO - Presentation layer only
// Risk Level: LOW
// ============================================================================

// PUBLIC_INTERFACE
/**
 * Ocean Professional theme colors for charts
 * @constant {Array<string>}
 */
export const CHART_COLORS = [
  '#3b82f6', // Primary blue
  '#06b6d4', // Success cyan
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#10b981', // Green
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#ef4444'  // Error red
];

// PUBLIC_INTERFACE
/**
 * Format data for line/area charts
 * @param {Array<Object>} data - Raw data array
 * @param {string} xKey - Key for x-axis
 * @param {Array<string>} yKeys - Keys for y-axis values
 * @returns {Array<Object>} Formatted chart data
 */
export const formatLineChartData = (data, xKey, yKeys) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  return data.map(item => {
    const formatted = { [xKey]: item[xKey] };
    yKeys.forEach(key => {
      formatted[key] = Number(item[key]) || 0;
    });
    return formatted;
  });
};

// PUBLIC_INTERFACE
/**
 * Format data for pie/donut charts
 * @param {Array<Object>} data - Raw data array
 * @param {string} nameKey - Key for segment name
 * @param {string} valueKey - Key for segment value
 * @returns {Array<Object>} Formatted chart data
 */
export const formatPieChartData = (data, nameKey, valueKey) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  return data.map(item => ({
    name: item[nameKey],
    value: Number(item[valueKey]) || 0
  }));
};

// PUBLIC_INTERFACE
/**
 * Format data for bar charts
 * @param {Array<Object>} data - Raw data array
 * @param {string} categoryKey - Key for category
 * @param {Array<string>} valueKeys - Keys for bar values
 * @returns {Array<Object>} Formatted chart data
 */
export const formatBarChartData = (data, categoryKey, valueKeys) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  return data.map(item => {
    const formatted = { [categoryKey]: item[categoryKey] };
    valueKeys.forEach(key => {
      formatted[key] = Number(item[key]) || 0;
    });
    return formatted;
  });
};

// PUBLIC_INTERFACE
/**
 * Get color by index from palette
 * @param {number} index - Color index
 * @returns {string} Hex color code
 */
export const getChartColor = (index) => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

// PUBLIC_INTERFACE
/**
 * Calculate percentage for display
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {string} Formatted percentage string
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};
