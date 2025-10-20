-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-012
-- User Story: Migrations table for tracking applied database migrations
-- GxP Impact: YES - Track database schema changes for validation
-- Risk Level: MEDIUM
-- ============================================================================

-- Create migrations table (if not exists from previous migration runner)
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    filename VARCHAR(255),
    checksum VARCHAR(64),
    applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
    applied_by VARCHAR(100) DEFAULT CURRENT_USER,
    execution_time_ms INTEGER,
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'rolled_back'))
);

-- Create indexes
CREATE INDEX idx_migrations_applied_at ON migrations(applied_at DESC);
CREATE INDEX idx_migrations_status ON migrations(status);

-- Comments
COMMENT ON TABLE migrations IS 'Tracks applied database migrations for schema version control';
COMMENT ON COLUMN migrations.id IS 'Sequential migration ID';
COMMENT ON COLUMN migrations.name IS 'Migration description';
COMMENT ON COLUMN migrations.filename IS 'SQL file name of migration';
COMMENT ON COLUMN migrations.checksum IS 'SHA256 checksum of migration file for integrity';
COMMENT ON COLUMN migrations.applied_at IS 'When migration was applied';
COMMENT ON COLUMN migrations.applied_by IS 'Database user who applied migration';
COMMENT ON COLUMN migrations.execution_time_ms IS 'Time taken to execute migration in milliseconds';
