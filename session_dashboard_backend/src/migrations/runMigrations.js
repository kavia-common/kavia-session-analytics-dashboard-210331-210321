// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-DB-002
// User Story: Database migration runner
// GxP Impact: YES - Database schema for GxP data
// Risk Level: HIGH
// ============================================================================

const { connectDatabase, query, closeDatabase } = require('../config/database');

// Migration scripts
const migrations = [
  {
    id: 1,
    name: 'Create users table',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Engineer', 'Viewer')),
        team_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX idx_users_username ON users(username);
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
    `
  },
  {
    id: 2,
    name: 'Create audit_trail table',
    up: `
      CREATE TABLE IF NOT EXISTS audit_trail (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        user_id INTEGER REFERENCES users(id),
        username VARCHAR(50) NOT NULL,
        action_type VARCHAR(20) NOT NULL,
        resource VARCHAR(255) NOT NULL,
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        status_code INTEGER,
        duration_ms INTEGER
      );
      
      CREATE INDEX idx_audit_timestamp ON audit_trail(timestamp);
      CREATE INDEX idx_audit_user_id ON audit_trail(user_id);
      CREATE INDEX idx_audit_action_type ON audit_trail(action_type);
    `
  },
  {
    id: 3,
    name: 'Create electronic_signatures table',
    up: `
      CREATE TABLE IF NOT EXISTS electronic_signatures (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        username VARCHAR(50) NOT NULL,
        signature_text VARCHAR(255) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        ip_address VARCHAR(45)
      );
      
      CREATE INDEX idx_signatures_user_id ON electronic_signatures(user_id);
      CREATE INDEX idx_signatures_timestamp ON electronic_signatures(timestamp);
    `
  },
  {
    id: 4,
    name: 'Create export_log table',
    up: `
      CREATE TABLE IF NOT EXISTS export_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        username VARCHAR(50) NOT NULL,
        export_format VARCHAR(10) NOT NULL,
        is_signed BOOLEAN DEFAULT false,
        signature_id INTEGER REFERENCES electronic_signatures(id),
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX idx_export_log_user_id ON export_log(user_id);
      CREATE INDEX idx_export_log_timestamp ON export_log(timestamp);
    `
  },
  {
    id: 5,
    name: 'Create role_change_log table',
    up: `
      CREATE TABLE IF NOT EXISTS role_change_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        new_role VARCHAR(20) NOT NULL,
        changed_by INTEGER NOT NULL REFERENCES users(id),
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX idx_role_change_user_id ON role_change_log(user_id);
      CREATE INDEX idx_role_change_timestamp ON role_change_log(timestamp);
    `
  },
  {
    id: 6,
    name: 'Create migrations table',
    up: `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `
  },
  {
    id: 7,
    name: 'Insert default admin user',
    up: `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (
        'admin',
        'admin@kavia.ai',
        '$2b$10$rQZYvJfE7KxqQqG5FqP2ZeZGZ8XqJ9k5mZl3KqYvJ5xP2qG5FqP2Ze',
        'Admin'
      )
      ON CONFLICT (username) DO NOTHING;
    `
  }
];

// Run migrations
const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migrations...');
    
    await connectDatabase();

    // Create migrations table if it doesn't exist
    await query(migrations[5].up);

    // Check which migrations have been applied
    const appliedResult = await query('SELECT id FROM migrations');
    const appliedIds = appliedResult.rows.map(row => row.id);

    // Run pending migrations
    for (const migration of migrations) {
      if (migration.id === 6) continue; // Skip migrations table creation

      if (appliedIds.includes(migration.id)) {
        console.log(`⏭️  Skipping migration ${migration.id}: ${migration.name} (already applied)`);
        continue;
      }

      console.log(`🔄 Running migration ${migration.id}: ${migration.name}`);
      
      await query(migration.up);
      await query(
        'INSERT INTO migrations (id, name) VALUES ($1, $2)',
        [migration.id, migration.name]
      );
      
      console.log(`✅ Migration ${migration.id} completed`);
    }

    console.log('✅ All migrations completed successfully');
    
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await closeDatabase();
    process.exit(1);
  }
};

runMigrations();
