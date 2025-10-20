// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FILTER-003
// User Story: User filter for analytics queries
// GxP Impact: YES - Filters affect data queries
// Risk Level: LOW
// ============================================================================

import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/analyticsService';
import './Filters.css';

// PUBLIC_INTERFACE
/**
 * UserFilter component for filtering by user
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback when user selection changes
 * @param {string} props.value - Current selected user ID
 * @param {string} props.teamId - Optional team ID to filter users
 * @returns {JSX.Element} UserFilter component
 */
const UserFilter = ({ onChange, value, teamId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers(teamId);
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [teamId]);

  return (
    <div className="filter-group">
      <label className="filter-label" htmlFor="user-filter">User</label>
      <select
        id="user-filter"
        className="filter-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        <option value="">All Users</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.username || user.email}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserFilter;
