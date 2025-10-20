// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-LAYOUT-003
// User Story: Main layout wrapper with navbar and sidebar
// Acceptance Criteria: 
//   - Wrap all authenticated pages
//   - Responsive layout structure
//   - Proper content scrolling
// GxP Impact: NO - Layout structure only
// Risk Level: LOW
// ============================================================================

import React from 'react';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import './MainLayout.css';

// PUBLIC_INTERFACE
/**
 * MainLayout component for authenticated pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element} MainLayout component
 */
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <TopNavbar />
      <div className="layout-container">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
