// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-002
// User Story: Unit tests for ProtectedRoute
// GxP Impact: YES - Access control is critical
// Risk Level: HIGH
// ============================================================================

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

// Mock the auth context
jest.mock('../../contexts/AuthContext');

// Mock Navigate component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  test('should show loading spinner while checking authentication', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
  });

  test('should redirect to login when not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveTextContent('/login');
  });

  test('should render content when authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: 1, username: 'testuser', role: 'Engineer' },
      loading: false,
      isAuthenticated: true
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('should deny access when user lacks required role', () => {
    useAuth.mockReturnValue({
      user: { id: 1, username: 'testuser', role: 'Viewer' },
      loading: false,
      isAuthenticated: true
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="Admin">
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText(/you do not have permission/i)).toBeInTheDocument();
  });

  test('should allow access when user has required role', () => {
    useAuth.mockReturnValue({
      user: { id: 1, username: 'testuser', role: 'Admin' },
      loading: false,
      isAuthenticated: true
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="Manager">
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
