-- ============================================================================
-- PostgreSQL Initialization Script
-- ============================================================================
-- This script runs automatically when PostgreSQL container first starts
-- It performs basic initialization before migrations are run
-- ============================================================================

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'UTC';

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL initialization completed';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'Version: %', version();
    RAISE NOTICE 'Timezone: %', current_setting('timezone');
END $$;
