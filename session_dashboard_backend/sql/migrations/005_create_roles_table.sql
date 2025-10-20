-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-007
-- User Story: Roles table for RBAC system
-- GxP Impact: YES - Access control for GxP compliance
-- Risk Level: HIGH
-- ============================================================================

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL CHECK (role_name IN ('Admin', 'Manager', 'Engineer', 'Viewer')),
    role_description TEXT,
    permissions JSONB NOT NULL,
    hierarchy_level INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_hierarchy_level UNIQUE (hierarchy_level)
);

-- Create indexes
CREATE INDEX idx_roles_name ON roles(role_name);
CREATE INDEX idx_roles_hierarchy ON roles(hierarchy_level);
CREATE INDEX idx_roles_is_active ON roles(is_active);
CREATE INDEX idx_roles_permissions ON roles USING GIN(permissions);

-- Create trigger for updated_at
CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE roles IS 'Role definitions for RBAC system. GxP-critical for access control.';
COMMENT ON COLUMN roles.role_name IS 'Role name: Admin, Manager, Engineer, or Viewer';
COMMENT ON COLUMN roles.permissions IS 'JSON object of permissions granted to this role';
COMMENT ON COLUMN roles.hierarchy_level IS 'Numeric hierarchy (1=highest, 4=lowest)';
COMMENT ON COLUMN roles.is_active IS 'Whether role is currently active';
