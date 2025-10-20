-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-008
-- User Story: Audit logs table for GxP compliance (ALCOA+)
-- GxP Impact: YES - Critical for regulatory compliance
-- Risk Level: CRITICAL
-- Validation Protocol: VP-AUDIT-001
-- ============================================================================

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INTEGER,
    username VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    action_description TEXT,
    http_method VARCHAR(10),
    endpoint VARCHAR(500),
    request_body JSONB,
    response_status INTEGER,
    old_values JSONB,
    new_values JSONB,
    reason_for_change TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    duration_ms INTEGER,
    is_success BOOLEAN DEFAULT true,
    error_message TEXT,
    compliance_category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for efficient audit trail queries
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_username ON audit_logs(username);
CREATE INDEX idx_audit_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_is_success ON audit_logs(is_success);
CREATE INDEX idx_audit_compliance_category ON audit_logs(compliance_category);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);

-- Create composite indexes for common queries
CREATE INDEX idx_audit_user_timestamp ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_resource_timestamp ON audit_logs(resource_type, resource_id, timestamp DESC);

-- Create GIN indexes for JSONB columns
CREATE INDEX idx_audit_request_body ON audit_logs USING GIN(request_body);
CREATE INDEX idx_audit_old_values ON audit_logs USING GIN(old_values);
CREATE INDEX idx_audit_new_values ON audit_logs USING GIN(new_values);

-- Partition audit_logs by month for better performance (optional, can be enabled later)
-- This is commented out but documented for future scaling needs
-- CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs 
--     FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Comments
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system operations. ALCOA+ compliant for GxP.';
COMMENT ON COLUMN audit_logs.timestamp IS 'Contemporaneous timestamp of action (ALCOA+)';
COMMENT ON COLUMN audit_logs.user_id IS 'Attributable user ID (ALCOA+)';
COMMENT ON COLUMN audit_logs.username IS 'Attributable username (ALCOA+)';
COMMENT ON COLUMN audit_logs.action_type IS 'Type of action (CREATE, READ, UPDATE, DELETE, LOGIN, etc.)';
COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource affected (user, session, export, etc.)';
COMMENT ON COLUMN audit_logs.old_values IS 'Original values before change (for data integrity)';
COMMENT ON COLUMN audit_logs.new_values IS 'New values after change (for data integrity)';
COMMENT ON COLUMN audit_logs.reason_for_change IS 'Documented reason for change (GxP requirement)';
COMMENT ON COLUMN audit_logs.compliance_category IS 'GxP compliance category (e.g., DATA_INTEGRITY, ACCESS_CONTROL)';
