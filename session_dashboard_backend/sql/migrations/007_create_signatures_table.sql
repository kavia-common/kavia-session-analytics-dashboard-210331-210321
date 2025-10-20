-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-009
-- User Story: Electronic signatures table for signed exports
-- GxP Impact: YES - Electronic signatures for 21 CFR Part 11 compliance
-- Risk Level: CRITICAL
-- Validation Protocol: VP-SIG-001
-- ============================================================================

-- Create electronic_signatures table
CREATE TABLE IF NOT EXISTS electronic_signatures (
    id SERIAL PRIMARY KEY,
    signature_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    signature_meaning VARCHAR(100) NOT NULL,
    signature_text VARCHAR(500) NOT NULL,
    password_verified BOOLEAN NOT NULL DEFAULT false,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    data_hash VARCHAR(64) NOT NULL,
    hash_algorithm VARCHAR(20) DEFAULT 'SHA256',
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    reason TEXT,
    audit_log_id BIGINT,
    export_log_id INTEGER,
    is_valid BOOLEAN DEFAULT true NOT NULL,
    invalidated_at TIMESTAMP,
    invalidated_by INTEGER,
    invalidation_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_signature_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_signature_audit FOREIGN KEY (audit_log_id) REFERENCES audit_logs(id) ON DELETE SET NULL,
    CONSTRAINT fk_invalidated_by FOREIGN KEY (invalidated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for electronic signatures
CREATE INDEX idx_signatures_signature_id ON electronic_signatures(signature_id);
CREATE INDEX idx_signatures_user_id ON electronic_signatures(user_id);
CREATE INDEX idx_signatures_timestamp ON electronic_signatures(timestamp DESC);
CREATE INDEX idx_signatures_action_type ON electronic_signatures(action_type);
CREATE INDEX idx_signatures_resource ON electronic_signatures(resource_type, resource_id);
CREATE INDEX idx_signatures_is_valid ON electronic_signatures(is_valid);
CREATE INDEX idx_signatures_data_hash ON electronic_signatures(data_hash);

-- Comments
COMMENT ON TABLE electronic_signatures IS 'Electronic signatures for GxP-compliant signed operations. 21 CFR Part 11 compliant.';
COMMENT ON COLUMN electronic_signatures.signature_id IS 'Unique signature identifier';
COMMENT ON COLUMN electronic_signatures.signature_meaning IS 'Meaning of signature (e.g., "Reviewed and Approved", "Data Export Authorized")';
COMMENT ON COLUMN electronic_signatures.signature_text IS 'Signature text (e.g., typed full name + date)';
COMMENT ON COLUMN electronic_signatures.password_verified IS 'Whether user password was verified at signing';
COMMENT ON COLUMN electronic_signatures.data_hash IS 'Hash of signed data for integrity verification';
COMMENT ON COLUMN electronic_signatures.hash_algorithm IS 'Algorithm used for hashing (default SHA256)';
COMMENT ON COLUMN electronic_signatures.is_valid IS 'Whether signature is currently valid';
COMMENT ON COLUMN electronic_signatures.invalidated_at IS 'When signature was invalidated (if applicable)';
COMMENT ON COLUMN electronic_signatures.invalidation_reason IS 'Reason for signature invalidation';
