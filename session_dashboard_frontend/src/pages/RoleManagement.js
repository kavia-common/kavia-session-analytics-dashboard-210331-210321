// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-PAGE-009
// User Story: Role management page for RBAC admin
// GxP Impact: YES - Critical for access control
// Risk Level: HIGH
// ============================================================================

import React, { useState, useEffect } from 'react';
import { getUsers, getRoles, assignRole } from '../services/analyticsService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/Toast';
import './Pages.css';

// PUBLIC_INTERFACE
/**
 * RoleManagement page component
 * @returns {JSX.Element} RoleManagement page
 */
const RoleManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getRoles()
        ]);
        setUsers(usersData || []);
        setRoles(rolesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdating(userId);
      await assignRole(userId, newRole);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      showToast('Role updated successfully', 'success');
    } catch (error) {
      console.error('Error updating role:', error);
      showToast('Failed to update role', 'error');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" message="Loading users and roles..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Role Management</h1>
        <p className="page-description">Manage user roles and permissions</p>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td><span className="badge badge-role">{user.role}</span></td>
                <td>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updating === user.id}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
