// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-DB-002
// User Story: Database migration runner with SQL file support
// GxP Impact: YES - Database schema for GxP data
// Risk Level: HIGH
// ============================================================================

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { connectDatabase, query, closeDatabase } = require('../config/database');

// PUBLIC_INTERFACE
/**
 * Calculate SHA256 checksum of file content
 * @param {string} content - File content
 * @returns {string} SHA256 hash
 */
function calculateChecksum(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// PUBLIC_INTERFACE
/**
 * Read and parse SQL migration files from directory
 * @returns {Promise<Array>} Array of migration objects
 */
async function loadMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../../sql/migrations');
  
  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    
    const migrations = await Promise.all(
      sqlFiles.map(async (filename) => {
        const filePath = path.join(migrationsDir, filename);
        const content = await fs.readFile(filePath, 'utf8');
        const match = filename.match(/^(\d+)_(.+)\.sql$/);
        
        if (!match) {
          console.warn(`⚠️  Skipping file with invalid name format: ${filename}`);
          return null;
        }
        
        const [, idStr, name] = match;
        return {
          id: parseInt(idStr, 10),
          name: name.replace(/_/g, ' '),
          filename,
          content,
          checksum: calculateChecksum(content)
        };
      })
    );
    
    return migrations.filter(m => m !== null);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📁 No SQL migrations directory found, using embedded migrations');
      return [];
    }
    throw error;
  }
}

// PUBLIC_INTERFACE
/**
 * Run SQL migration with timing
 * @param {Object} migration - Migration object
 * @returns {Promise<number>} Execution time in milliseconds
 */
async function runMigration(migration) {
  const startTime = Date.now();
  
  try {
    // Split by semicolon and execute each statement
    const statements = migration.content
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      await query(statement);
    }
    
    const executionTime = Date.now() - startTime;
    
    // Record migration
    await query(
      `INSERT INTO migrations (id, name, filename, checksum, execution_time_ms, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         checksum = EXCLUDED.checksum,
         execution_time_ms = EXCLUDED.execution_time_ms`,
      [migration.id, migration.name, migration.filename, migration.checksum, executionTime, 'success']
    );
    
    return executionTime;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    // Record failed migration
    await query(
      `INSERT INTO migrations (id, name, filename, checksum, execution_time_ms, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
      [migration.id, migration.name, migration.filename, migration.checksum, executionTime, 'failed']
    );
    
    throw error;
  }
}

// PUBLIC_INTERFACE
/**
 * Main migration runner function
 */
async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...\n');
    
    await connectDatabase();

    // First, ensure migrations table exists
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        filename VARCHAR(255),
        checksum VARCHAR(64),
        applied_at TIMESTAMP NOT NULL DEFAULT NOW(),
        applied_by VARCHAR(100) DEFAULT CURRENT_USER,
        execution_time_ms INTEGER,
        status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'rolled_back'))
      )
    `);

    // Load migration files
    const migrations = await loadMigrationFiles();
    
    if (migrations.length === 0) {
      console.log('ℹ️  No migration files found');
      await closeDatabase();
      process.exit(0);
    }

    // Check which migrations have been applied
    const appliedResult = await query('SELECT id, checksum FROM migrations WHERE status = $1', ['success']);
    const appliedMigrations = new Map(
      appliedResult.rows.map(row => [row.id, row.checksum])
    );

    let appliedCount = 0;
    let skippedCount = 0;

    // Run pending migrations
    for (const migration of migrations) {
      const appliedChecksum = appliedMigrations.get(migration.id);
      
      if (appliedChecksum) {
        if (appliedChecksum === migration.checksum) {
          console.log(`⏭️  Skipping migration ${migration.id}: ${migration.name} (already applied)`);
          skippedCount++;
        } else {
          console.warn(`⚠️  WARNING: Migration ${migration.id} checksum changed!`);
          console.warn(`   Previous: ${appliedChecksum}`);
          console.warn(`   Current:  ${migration.checksum}`);
          console.warn(`   Skipping to avoid data corruption...`);
          skippedCount++;
        }
        continue;
      }

      console.log(`🔄 Running migration ${migration.id}: ${migration.name}`);
      
      const executionTime = await runMigration(migration);
      
      console.log(`✅ Migration ${migration.id} completed in ${executionTime}ms\n`);
      appliedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Migration summary:`);
    console.log(`   Applied: ${appliedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total:   ${migrations.length}`);
    console.log('='.repeat(60) + '\n');

    // Run seed data if no sessions exist (fresh database)
    const sessionsCount = await query('SELECT COUNT(*) as count FROM sessions');
    if (sessionsCount.rows[0].count === '0') {
      console.log('🌱 Running seed data...\n');
      const seedPath = path.join(__dirname, '../../sql/seeds/seed_data.sql');
      try {
        const seedContent = await fs.readFile(seedPath, 'utf8');
        const seedStatements = seedContent
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (const statement of seedStatements) {
          await query(statement);
        }
        console.log('✅ Seed data completed\n');
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('ℹ️  No seed data file found, skipping...\n');
        } else {
          throw error;
        }
      }
    }

    await closeDatabase();
    console.log('✅ All migrations completed successfully\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    await closeDatabase();
    process.exit(1);
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations, loadMigrationFiles };
