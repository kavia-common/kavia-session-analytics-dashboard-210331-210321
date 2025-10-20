// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-CHART-002
// User Story: Reusable bar chart component for comparisons
// GxP Impact: NO - Presentation layer
// Risk Level: LOW
// ============================================================================

import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../../utils/chartUtils';

// PUBLIC_INTERFACE
/**
 * BarChart component for displaying comparison data
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Chart data
 * @param {string} props.xKey - Key for x-axis (category)
 * @param {Array<string>} props.yKeys - Keys for y-axis bars
 * @param {number} props.height - Chart height in pixels
 * @param {string} props.title - Chart title
 * @param {boolean} props.horizontal - Horizontal bars if true
 */
const BarChart = ({ 
  data = [], 
  xKey = 'category', 
  yKeys = ['value'], 
  height = 300,
  title = '',
  horizontal = false
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

  const ChartComponent = RechartsBarChart;
  const layout = horizontal ? 'horizontal' : 'vertical';

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent 
          data={data} 
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          {horizontal ? (
            <>
              <XAxis type="number" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
              <YAxis dataKey={xKey} type="category" stroke="var(--text-secondary)" style={{ fontSize: '12px' }} width={100} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
            </>
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border-color)',
              borderRadius: '4px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
