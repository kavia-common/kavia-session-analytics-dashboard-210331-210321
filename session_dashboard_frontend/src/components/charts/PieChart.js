// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-CHART-003
// User Story: Reusable pie chart component for distribution visualization
// GxP Impact: NO - Presentation layer
// Risk Level: LOW
// ============================================================================

import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/chartUtils';

// PUBLIC_INTERFACE
/**
 * PieChart component for displaying distribution data
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Chart data with 'name' and 'value' keys
 * @param {number} props.height - Chart height in pixels
 * @param {string} props.title - Chart title
 * @param {boolean} props.showLegend - Show legend if true
 */
const PieChart = ({ 
  data = [], 
  height = 300,
  title = '',
  showLegend = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        No data available
      </div>
    );
  }

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border-color)',
              borderRadius: '4px'
            }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
