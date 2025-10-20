// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FILTER-002
// User Story: Team filter for analytics queries
// GxP Impact: YES - Filters affect data queries
// Risk Level: LOW
// ============================================================================

import React, { useEffect, useState } from 'react';
import { getTeams } from '../../services/analyticsService';
import './Filters.css';

// PUBLIC_INTERFACE
/**
 * TeamFilter component for filtering by team
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback when team selection changes
 * @param {string} props.value - Current selected team ID
 * @returns {JSX.Element} TeamFilter component
 */
const TeamFilter = ({ onChange, value }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const data = await getTeams();
        setTeams(data || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="filter-group">
      <label className="filter-label" htmlFor="team-filter">Team</label>
      <select
        id="team-filter"
        className="filter-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        <option value="">All Teams</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamFilter;
