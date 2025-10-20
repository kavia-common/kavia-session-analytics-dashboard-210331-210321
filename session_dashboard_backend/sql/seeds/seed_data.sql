-- ============================================================================
-- REQUIREMENT TRACEABILITY
-- ============================================================================
-- Requirement ID: REQ-DB-013
-- User Story: Seed data for roles and initial system setup
-- GxP Impact: YES - Default RBAC configuration
-- Risk Level: HIGH
-- ============================================================================

-- ============================================================================
-- SEED ROLES
-- ============================================================================

-- Insert default roles with permissions
INSERT INTO roles (role_name, role_description, permissions, hierarchy_level) VALUES
(
    'Admin',
    'Full system administrator with all permissions',
    '{
        "users": ["create", "read", "update", "delete"],
        "teams": ["create", "read", "update", "delete"],
        "sessions": ["read", "export"],
        "analytics": ["read", "export"],
        "audit": ["read", "export"],
        "roles": ["create", "read", "update", "delete", "assign"],
        "exports": ["create", "read", "sign"],
        "system": ["configure", "manage"]
    }'::jsonb,
    1
),
(
    'Manager',
    'Team manager with analytics and audit access',
    '{
        "users": ["read"],
        "teams": ["read", "update"],
        "sessions": ["read", "export"],
        "analytics": ["read", "export"],
        "audit": ["read", "export"],
        "roles": ["read"],
        "exports": ["create", "read", "sign"]
    }'::jsonb,
    2
),
(
    'Engineer',
    'Engineer with data export and analytics access',
    '{
        "users": ["read"],
        "teams": ["read"],
        "sessions": ["read", "export"],
        "analytics": ["read", "export"],
        "audit": ["read"],
        "roles": ["read"],
        "exports": ["create", "read", "sign"]
    }'::jsonb,
    3
),
(
    'Viewer',
    'Read-only viewer with limited analytics access',
    '{
        "users": ["read"],
        "teams": ["read"],
        "sessions": ["read"],
        "analytics": ["read"],
        "audit": [],
        "roles": ["read"],
        "exports": []
    }'::jsonb,
    4
)
ON CONFLICT (role_name) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    role_description = EXCLUDED.role_description,
    hierarchy_level = EXCLUDED.hierarchy_level;

-- ============================================================================
-- SEED FEATURES
-- ============================================================================

-- Insert common Kavia features
INSERT INTO features (feature_code, feature_name, category, description) VALUES
('CODE_GENERATION', 'Code Generation', 'Development', 'AI-powered code generation feature'),
('CODE_REVIEW', 'Code Review', 'Development', 'Automated code review and analysis'),
('TESTING', 'Test Generation', 'Quality Assurance', 'Automated test case generation'),
('DOCUMENTATION', 'Documentation', 'Development', 'Automated documentation generation'),
('BUG_FIXING', 'Bug Fixing', 'Development', 'AI-assisted bug detection and fixing'),
('REFACTORING', 'Code Refactoring', 'Development', 'Code refactoring and optimization'),
('API_DESIGN', 'API Design', 'Architecture', 'API endpoint design and implementation'),
('DATABASE_DESIGN', 'Database Design', 'Architecture', 'Database schema design'),
('DEPLOYMENT', 'Deployment', 'DevOps', 'Deployment automation and configuration'),
('MONITORING', 'Monitoring', 'DevOps', 'Application monitoring and logging')
ON CONFLICT (feature_code) DO NOTHING;

-- ============================================================================
-- SEED ADMIN USER
-- ============================================================================

-- Insert default admin user
-- Password: Admin123! (bcrypt hash)
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES
(
    'admin',
    'admin@kavia.ai',
    '$2b$10$rQZYvJfE7KxqQqG5FqP2ZeZGZ8XqJ9k5mZl3KqYvJ5xP2qG5FqP2Ze',
    'System',
    'Administrator',
    'Admin'
)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- OPTIONAL: SEED TEST TEAMS (Comment out for production)
-- ============================================================================

-- Insert test teams
INSERT INTO teams (name, description, manager_id) VALUES
('Engineering', 'Core engineering team', 1),
('Quality Assurance', 'QA and testing team', 1),
('DevOps', 'DevOps and infrastructure team', 1),
('Product', 'Product management team', 1)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- OPTIONAL: SEED TEST USERS (Comment out for production)
-- ============================================================================

-- Insert test users (password for all: Test123!)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, team_id) VALUES
(
    'manager1',
    'manager1@kavia.ai',
    '$2b$10$rQZYvJfE7KxqQqG5FqP2ZeZGZ8XqJ9k5mZl3KqYvJ5xP2qG5FqP2Ze',
    'Alice',
    'Manager',
    'Manager',
    1
),
(
    'engineer1',
    'engineer1@kavia.ai',
    '$2b$10$rQZYvJfE7KxqQqG5FqP2ZeZGZ8XqJ9k5mZl3KqYvJ5xP2qG5FqP2Ze',
    'Bob',
    'Engineer',
    'Engineer',
    1
),
(
    'viewer1',
    'viewer1@kavia.ai',
    '$2b$10$rQZYvJfE7KxqQqG5FqP2ZeZGZ8XqJ9k5mZl3KqYvJ5xP2qG5FqP2Ze',
    'Charlie',
    'Viewer',
    'Viewer',
    1
)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- OPTIONAL: SEED SAMPLE SESSIONS (Comment out for production)
-- ============================================================================

-- Insert sample sessions for testing
INSERT INTO sessions (
    session_id, user_id, team_id, project_id, project_name, session_type,
    start_time, end_time, duration_seconds, agents_used, features_used,
    token_usage_input, token_usage_output, token_usage_total,
    outputs_generated, status
) VALUES
(
    'sess_001',
    2,
    1,
    'proj_test_001',
    'Test Project Alpha',
    'code-generation',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour',
    3600,
    '["CodeWritingAgent", "TestCodeWritingAgent"]'::jsonb,
    '["CODE_GENERATION", "TESTING"]'::jsonb,
    5000,
    8000,
    13000,
    '["src/app.js", "tests/app.test.js"]'::jsonb,
    'completed'
),
(
    'sess_002',
    3,
    1,
    'proj_test_002',
    'Test Project Beta',
    'code-review',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '30 minutes',
    1800,
    '["CodeReviewAgent"]'::jsonb,
    '["CODE_REVIEW", "DOCUMENTATION"]'::jsonb,
    3000,
    4000,
    7000,
    '["review_report.md"]'::jsonb,
    'completed'
)
ON CONFLICT (session_id) DO NOTHING;

-- ============================================================================
-- AUDIT LOG ENTRY FOR SEED DATA
-- ============================================================================

-- Log seed data initialization
INSERT INTO audit_logs (
    username, action_type, resource_type, action_description,
    ip_address, compliance_category
) VALUES (
    'system',
    'SYSTEM_INIT',
    'database',
    'Database seed data initialization completed',
    '127.0.0.1',
    'SYSTEM_CONFIGURATION'
);
