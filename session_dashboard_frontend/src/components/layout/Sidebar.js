// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-LAYOUT-002
// User Story: Sidebar navigation for analytics pages
// Acceptance Criteria: 
//   - Navigation links to all pages
//   - Active route highlighting
//   - Role-based menu items
//   - Collapsible on mobile
// GxP Impact: NO - Navigation only
// Risk Level: LOW
// ============================================================================

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../../constants/roles';
import './Sidebar.css';

// PUBLIC_INTERFACE
/**
 * Sidebar component for navigation menu
 * @returns {JSX.Element} Sidebar component
 */
const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const permissions = user ? PERMISSIONS[user.role] || {} : {};

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      visible: permissions.canViewDashboard
    },
    {
      path: '/feature-usage',
      label: 'Feature Usage',
      icon: '📈',
      visible: permissions.canViewAnalytics
    },
    {
      path: '/trends',
      label: 'Trends',
      icon: '📉',
      visible: permissions.canViewAnalytics
    },
    {
      path: '/team-usage',
      label: 'Team Usage',
      icon: '👥',
      visible: permissions.canViewAnalytics
    },
    {
      path: '/user-analysis',
      label: 'User Analysis',
      icon: '👤',
      visible: permissions.canViewAnalytics
    },
    {
      path: '/exports',
      label: 'Exports',
      icon: '📥',
      visible: permissions.canExportData
    },
    {
      path: '/audit-trail',
      label: 'Audit Trail',
      icon: '📋',
      visible: permissions.canViewAuditTrail
    },
    {
      path: '/role-management',
      label: 'Role Management',
      icon: '🔐',
      visible: permissions.canManageRoles
    }
  ];

  const visibleMenuItems = menuItems.filter(item => item.visible);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>
      
      <nav className="sidebar-nav">
        {visibleMenuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
