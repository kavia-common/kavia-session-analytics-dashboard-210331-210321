-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-006
-- User Story: Features table for tracking product features
-- GxP Impact: YES - Feature usage tracking for analytics
-- Risk Level: MEDIUM
-- ============================================================================

-- Create features table
CREATE TABLE IF NOT EXISTS features (
    id SERIAL PRIMARY KEY,
    feature_code VARCHAR(100) UNIQUE NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_deprecated BOOLEAN DEFAULT false NOT NULL,
    deprecated_at TIMESTAMP,
    replacement_feature_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_replacement_feature FOREIGN KEY (replacement_feature_id) REFERENCES features(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_features_code ON features(feature_code);
CREATE INDEX idx_features_name ON features(feature_name);
CREATE INDEX idx_features_category ON features(category);
CREATE INDEX idx_features_is_active ON features(is_active);
CREATE INDEX idx_features_is_deprecated ON features(is_deprecated);

-- Create trigger for updated_at
CREATE TRIGGER update_features_updated_at 
    BEFORE UPDATE ON features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE features IS 'Product features catalog for usage tracking';
COMMENT ON COLUMN features.feature_code IS 'Unique feature code identifier';
COMMENT ON COLUMN features.feature_name IS 'Human-readable feature name';
COMMENT ON COLUMN features.category IS 'Feature category grouping';
COMMENT ON COLUMN features.is_active IS 'Whether feature is currently active';
COMMENT ON COLUMN features.is_deprecated IS 'Whether feature is deprecated';
COMMENT ON COLUMN features.replacement_feature_id IS 'ID of feature that replaces this one if deprecated';
