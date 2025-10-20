// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-CHART-001
// User Story: Reusable line chart component for trend visualization
// GxP Impact: NO - Presentation layer
// Risk Level: LOW
// ============================================================================

import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/chartUtils';

// PUBLIC_INTERFACE
/**
 * LineChart component for displaying trend data
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Chart data
 * @param {string} props.xKey - Key for x-axis
 * @param {Array<string>} props.yKeys - Keys for y-axis lines
 * @param {number} props.height - Chart height in pixels
 * @param {string} props.title - Chart title
 */
const LineChart = ({ 
  data = [], 
  xKey = 'date', 
  yKeys = ['value'], 
  height = 300,
  title = ''
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey={xKey} 
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border-color)',
              borderRadius: '4px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          {yKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
