// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-003
// User Story: Unit tests for Dashboard page
// GxP Impact: YES - Dashboard displays analytics data
// Risk Level: MEDIUM
// ============================================================================

import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import * as analyticsService from '../services/analyticsService';

// Mock the analytics service
jest.mock('../services/analyticsService');

// Mock the chart components
jest.mock('../components/charts/LineChart', () => {
  return function MockLineChart() {
    return <div data-testid="line-chart">Line Chart</div>;
  };
});

jest.mock('../components/charts/PieChart', () => {
  return function MockPieChart() {
    return <div data-testid="pie-chart">Pie Chart</div>;
  };
});

describe('Dashboard', () => {
  const mockDashboardData = {
    totalSessions: 150,
    activeUsers: 45,
    totalFeatures: 12,
    avgDuration: '15m',
    sessionTrends: [
      { date: '2024-01-01', sessions: 10 },
      { date: '2024-01-02', sessions: 15 }
    ],
    featureDistribution: [
      { name: 'Feature A', value: 30 },
      { name: 'Feature B', value: 20 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should show loading spinner initially', () => {
    analyticsService.getDashboardSummary.mockImplementation(() => new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  test('should display dashboard data when loaded', async () => {
    analyticsService.getDashboardSummary.mockResolvedValue(mockDashboardData);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('15m')).toBeInTheDocument();
    });
  });

  test('should display error message on fetch failure', async () => {
    analyticsService.getDashboardSummary.mockRejectedValue(new Error('Network error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('should render charts when data is available', async () => {
    analyticsService.getDashboardSummary.mockResolvedValue(mockDashboardData);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });
});
