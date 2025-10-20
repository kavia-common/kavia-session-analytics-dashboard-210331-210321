-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-010
-- User Story: Export logs table for tracking data exports
-- GxP Impact: YES - Track all data exports for compliance
-- Risk Level: HIGH
-- ============================================================================

-- Create export_logs table
CREATE TABLE IF NOT EXISTS export_logs (
    id SERIAL PRIMARY KEY,
    export_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    export_type VARCHAR(20) NOT NULL CHECK (export_type IN ('CSV', 'JSON', 'PDF', 'EXCEL')),
    export_format VARCHAR(20) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    filters_applied JSONB,
    record_count INTEGER,
    file_size_bytes BIGINT,
    file_path VARCHAR(500),
    file_hash VARCHAR(64),
    is_signed BOOLEAN DEFAULT false,
    signature_id INTEGER,
    signature_meaning VARCHAR(100),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    duration_ms INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('initiated', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_export_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_export_signature FOREIGN KEY (signature_id) REFERENCES electronic_signatures(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_export_export_id ON export_logs(export_id);
CREATE INDEX idx_export_user_id ON export_logs(user_id);
CREATE INDEX idx_export_timestamp ON export_logs(timestamp DESC);
CREATE INDEX idx_export_type ON export_logs(export_type);
CREATE INDEX idx_export_data_type ON export_logs(data_type);
CREATE INDEX idx_export_is_signed ON export_logs(is_signed);
CREATE INDEX idx_export_signature_id ON export_logs(signature_id);
CREATE INDEX idx_export_status ON export_logs(status);
CREATE INDEX idx_export_filters ON export_logs USING GIN(filters_applied);

-- Create trigger for updated_at (if we add updated_at column)
-- CREATE TRIGGER update_export_logs_updated_at 
--     BEFORE UPDATE ON export_logs
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE export_logs IS 'Logs of all data exports for audit trail and compliance';
COMMENT ON COLUMN export_logs.export_id IS 'Unique export identifier';
COMMENT ON COLUMN export_logs.export_type IS 'Export file type (CSV, JSON, PDF, EXCEL)';
COMMENT ON COLUMN export_logs.data_type IS 'Type of data exported (sessions, users, analytics, etc.)';
COMMENT ON COLUMN export_logs.filters_applied IS 'JSON of filters applied to export';
COMMENT ON COLUMN export_logs.is_signed IS 'Whether export was electronically signed';
COMMENT ON COLUMN export_logs.file_hash IS 'Hash of exported file for integrity verification';
