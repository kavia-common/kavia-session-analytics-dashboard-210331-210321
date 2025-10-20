-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-004
-- User Story: Teams table for organizing users
-- GxP Impact: YES - Team-based access control and analytics
-- Risk Level: MEDIUM
-- ============================================================================

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    manager_id INTEGER,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_team_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_team_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_teams_manager_id ON teams(manager_id);
CREATE INDEX idx_teams_is_active ON teams(is_active);

-- Add foreign key from users to teams (circular reference handled after both tables exist)
ALTER TABLE users 
    ADD CONSTRAINT fk_users_team 
    FOREIGN KEY (team_id) 
    REFERENCES teams(id) 
    ON DELETE SET NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE teams IS 'Teams for organizing users and analytics grouping';
COMMENT ON COLUMN teams.id IS 'Unique team identifier';
COMMENT ON COLUMN teams.name IS 'Team name (unique)';
COMMENT ON COLUMN teams.manager_id IS 'User ID of team manager';
COMMENT ON COLUMN teams.is_active IS 'Whether team is active';
