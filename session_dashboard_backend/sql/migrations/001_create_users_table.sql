-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-003
-- User Story: Users table for authentication and authorization
-- GxP Impact: YES - User identity and access control
-- Risk Level: HIGH
-- Validation Protocol: VP-DB-001
-- ============================================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Engineer', 'Viewer')),
    team_id INTEGER,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_locked BOOLEAN DEFAULT false NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with authentication and authorization data. GxP-critical for audit trail attribution.';
COMMENT ON COLUMN users.id IS 'Unique user identifier';
COMMENT ON COLUMN users.username IS 'Unique username for login';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: Admin, Manager, Engineer, or Viewer';
COMMENT ON COLUMN users.team_id IS 'Reference to team (not enforced FK for flexibility)';
COMMENT ON COLUMN users.is_active IS 'Whether user account is active';
COMMENT ON COLUMN users.is_locked IS 'Whether user account is locked due to failed logins';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for failed login attempts';
COMMENT ON COLUMN users.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when user was last updated';
