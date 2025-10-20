-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-005
-- User Story: Sessions table for user session analytics data
-- GxP Impact: YES - Core analytics data for product usage
-- Risk Level: HIGH
-- ============================================================================

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    team_id INTEGER,
    project_id VARCHAR(255),
    project_name VARCHAR(255),
    session_type VARCHAR(50),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    agents_used JSONB,
    features_used JSONB,
    token_usage_input INTEGER DEFAULT 0,
    token_usage_output INTEGER DEFAULT 0,
    token_usage_total INTEGER DEFAULT 0,
    outputs_generated JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'abandoned')),
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sessions_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- Create indexes for performance on frequently queried fields
CREATE INDEX idx_sessions_session_id ON sessions(session_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_team_id ON sessions(team_id);
CREATE INDEX idx_sessions_project_id ON sessions(project_id);
CREATE INDEX idx_sessions_session_type ON sessions(session_type);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_sessions_end_time ON sessions(end_time);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);

-- Create GIN indexes for JSONB columns (for efficient querying)
CREATE INDEX idx_sessions_agents_used ON sessions USING GIN(agents_used);
CREATE INDEX idx_sessions_features_used ON sessions USING GIN(features_used);
CREATE INDEX idx_sessions_outputs_generated ON sessions USING GIN(outputs_generated);
CREATE INDEX idx_sessions_metadata ON sessions USING GIN(metadata);

-- Create trigger for updated_at
CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE sessions IS 'User session data for analytics. Core GxP data for product usage tracking.';
COMMENT ON COLUMN sessions.session_id IS 'Unique session identifier from Kavia platform';
COMMENT ON COLUMN sessions.user_id IS 'User who created this session';
COMMENT ON COLUMN sessions.team_id IS 'Team associated with this session';
COMMENT ON COLUMN sessions.project_id IS 'Project identifier';
COMMENT ON COLUMN sessions.session_type IS 'Type of session (e.g., code-generation, analysis)';
COMMENT ON COLUMN sessions.start_time IS 'Session start timestamp';
COMMENT ON COLUMN sessions.end_time IS 'Session end timestamp';
COMMENT ON COLUMN sessions.duration_seconds IS 'Session duration in seconds';
COMMENT ON COLUMN sessions.agents_used IS 'JSON array of agents used in session';
COMMENT ON COLUMN sessions.features_used IS 'JSON array of features used in session';
COMMENT ON COLUMN sessions.token_usage_input IS 'Input tokens consumed';
COMMENT ON COLUMN sessions.token_usage_output IS 'Output tokens generated';
COMMENT ON COLUMN sessions.token_usage_total IS 'Total tokens used';
COMMENT ON COLUMN sessions.outputs_generated IS 'JSON array of outputs generated';
COMMENT ON COLUMN sessions.status IS 'Session status: active, completed, failed, abandoned';
