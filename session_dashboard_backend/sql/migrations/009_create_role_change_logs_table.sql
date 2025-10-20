-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-011
-- User Story: Role change logs for tracking RBAC changes
-- GxP Impact: YES - Track all access control changes
-- Risk Level: HIGH
-- ============================================================================

-- Create role_change_logs table
CREATE TABLE IF NOT EXISTS role_change_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    old_role VARCHAR(20),
    new_role VARCHAR(20) NOT NULL,
    changed_by INTEGER NOT NULL,
    reason TEXT NOT NULL,
    effective_date TIMESTAMP NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMP,
    approval_required BOOLEAN DEFAULT false,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_role_change_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_changed_by FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_role_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_role_change_user_id ON role_change_logs(user_id);
CREATE INDEX idx_role_change_timestamp ON role_change_logs(timestamp DESC);
CREATE INDEX idx_role_change_changed_by ON role_change_logs(changed_by);
CREATE INDEX idx_role_change_new_role ON role_change_logs(new_role);
CREATE INDEX idx_role_change_effective_date ON role_change_logs(effective_date);

-- Comments
COMMENT ON TABLE role_change_logs IS 'Audit log of all role changes for access control tracking';
COMMENT ON COLUMN role_change_logs.old_role IS 'Previous role before change';
COMMENT ON COLUMN role_change_logs.new_role IS 'New role after change';
COMMENT ON COLUMN role_change_logs.changed_by IS 'User ID who performed the role change';
COMMENT ON COLUMN role_change_logs.reason IS 'Documented reason for role change (GxP requirement)';
COMMENT ON COLUMN role_change_logs.effective_date IS 'When role change becomes effective';
COMMENT ON COLUMN role_change_logs.expiry_date IS 'Optional expiry date for temporary role assignments';
