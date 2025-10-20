// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-APP-001
// User Story: Main application component with routing and providers
// GxP Impact: YES - Entry point for authenticated application
// Risk Level: HIGH
// ============================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/routing/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeatureUsage from './pages/FeatureUsage';
import Trends from './pages/Trends';
import TeamUsage from './pages/TeamUsage';
import UserAnalysis from './pages/UserAnalysis';
import Exports from './pages/Exports';
import AuditTrail from './pages/AuditTrail';
import RoleManagement from './pages/RoleManagement';

import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component
 * @returns {JSX.Element} Application root
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/feature-usage"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <FeatureUsage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/trends"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Trends />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/team-usage"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <TeamUsage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/user-analysis"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <UserAnalysis />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/exports"
                  element={
                    <ProtectedRoute requiredRole="Engineer">
                      <MainLayout>
                        <Exports />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/audit-trail"
                  element={
                    <ProtectedRoute requiredRole="Manager">
                      <MainLayout>
                        <AuditTrail />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/role-management"
                  element={
                    <ProtectedRoute requiredRole="Admin">
                      <MainLayout>
                        <RoleManagement />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 404 catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
