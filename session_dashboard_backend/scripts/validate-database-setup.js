#!/usr/bin/env node

// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-VALIDATION-001
// User Story: Validate database setup and schema integrity
// GxP Impact: YES - Validates GxP-compliant database structure
// Risk Level: HIGH
// ============================================================================

const fs = require('fs').promises;
const path = require('path');

// PUBLIC_INTERFACE
/**
 * Validate database setup files and structure
 * @returns {Promise<Object>} Validation results
 */
async function validateDatabaseSetup() {
  const results = {
    valid: true,
    checks: [],
    errors: [],
    warnings: []
  };

  console.log('🔍 Validating database setup...\n');

  // Check 1: Docker Compose file exists
  try {
    const dockerComposePath = path.join(__dirname, '../docker-compose.yml');
    await fs.access(dockerComposePath);
    results.checks.push('✅ docker-compose.yml exists');
  } catch (error) {
    results.valid = false;
    results.errors.push('❌ docker-compose.yml not found');
  }

  // Check 2: Migration files exist
  try {
    const migrationsDir = path.join(__dirname, '../sql/migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    
    if (sqlFiles.length >= 10) {
      results.checks.push(`✅ Found ${sqlFiles.length} migration files`);
    } else {
      results.valid = false;
      results.errors.push(`❌ Expected at least 10 migration files, found ${sqlFiles.length}`);
    }

    // Verify migration file naming convention
    const expectedMigrations = [
      '001_create_users_table.sql',
      '002_create_teams_table.sql',
      '003_create_sessions_table.sql',
      '004_create_features_table.sql',
      '005_create_roles_table.sql',
      '006_create_audit_logs_table.sql',
      '007_create_signatures_table.sql',
      '008_create_export_logs_table.sql',
      '009_create_role_change_logs_table.sql',
      '010_create_migrations_table.sql'
    ];

    for (const expected of expectedMigrations) {
      if (sqlFiles.includes(expected)) {
        results.checks.push(`✅ Migration file: ${expected}`);
      } else {
        results.valid = false;
        results.errors.push(`❌ Missing migration file: ${expected}`);
      }
    }
  } catch (error) {
    results.valid = false;
    results.errors.push('❌ sql/migrations directory not found');
  }

  // Check 3: Seed data exists
  try {
    const seedPath = path.join(__dirname, '../sql/seeds/seed_data.sql');
    await fs.access(seedPath);
    const seedContent = await fs.readFile(seedPath, 'utf8');
    
    // Verify seed data contains key elements
    const requiredElements = [
      'INSERT INTO roles',
      'INSERT INTO features',
      'INSERT INTO users',
      'Admin',
      'Manager',
      'Engineer',
      'Viewer'
    ];

    for (const element of requiredElements) {
      if (seedContent.includes(element)) {
        results.checks.push(`✅ Seed data contains: ${element}`);
      } else {
        results.warnings.push(`⚠️  Seed data may be missing: ${element}`);
      }
    }
  } catch (error) {
    results.valid = false;
    results.errors.push('❌ sql/seeds/seed_data.sql not found');
  }

  // Check 4: Migration runner exists
  try {
    const runnerPath = path.join(__dirname, '../src/migrations/runMigrations.js');
    await fs.access(runnerPath);
    results.checks.push('✅ Migration runner exists');
  } catch (error) {
    results.valid = false;
    results.errors.push('❌ src/migrations/runMigrations.js not found');
  }

  // Check 5: Database config exists
  try {
    const configPath = path.join(__dirname, '../src/config/database.js');
    await fs.access(configPath);
    results.checks.push('✅ Database config exists');
  } catch (error) {
    results.valid = false;
    results.errors.push('❌ src/config/database.js not found');
  }

  // Check 6: Environment example exists
  try {
    const envExamplePath = path.join(__dirname, '../.env.example');
    await fs.access(envExamplePath);
    const envContent = await fs.readFile(envExamplePath, 'utf8');
    
    if (envContent.includes('DATABASE_URL') && 
        envContent.includes('POSTGRES_USER') &&
        envContent.includes('JWT_SECRET')) {
      results.checks.push('✅ .env.example has required variables');
    } else {
      results.warnings.push('⚠️  .env.example may be incomplete');
    }
  } catch (error) {
    results.warnings.push('⚠️  .env.example not found');
  }

  // Check 7: Documentation exists
  try {
    const dbReadmePath = path.join(__dirname, '../README_DATABASE.md');
    await fs.access(dbReadmePath);
    results.checks.push('✅ README_DATABASE.md exists');
  } catch (error) {
    results.warnings.push('⚠️  README_DATABASE.md not found');
  }

  try {
    const quickstartPath = path.join(__dirname, '../QUICKSTART_DATABASE.md');
    await fs.access(quickstartPath);
    results.checks.push('✅ QUICKSTART_DATABASE.md exists');
  } catch (error) {
    results.warnings.push('⚠️  QUICKSTART_DATABASE.md not found');
  }

  // Check 8: Package.json has migration scripts
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageContent = await fs.readFile(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const requiredScripts = ['migrate', 'db:start', 'db:stop', 'db:shell'];
    for (const script of requiredScripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        results.checks.push(`✅ npm script: ${script}`);
      } else {
        results.warnings.push(`⚠️  Missing npm script: ${script}`);
      }
    }

    // Check for pg dependency
    if (packageJson.dependencies && packageJson.dependencies.pg) {
      results.checks.push('✅ pg (PostgreSQL) dependency present');
    } else {
      results.valid = false;
      results.errors.push('❌ Missing pg (PostgreSQL) dependency');
    }
  } catch (error) {
    results.warnings.push('⚠️  Could not validate package.json');
  }

  // Print results
  console.log('\n' + '='.repeat(70));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(70) + '\n');

  console.log('✅ Successful Checks:');
  results.checks.forEach(check => console.log(`  ${check}`));

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(error => console.log(`  ${error}`));
  }

  console.log('\n' + '='.repeat(70));
  if (results.valid) {
    console.log('✅ VALIDATION PASSED - Database setup is complete');
  } else {
    console.log('❌ VALIDATION FAILED - Please fix the errors above');
  }
  console.log('='.repeat(70) + '\n');

  return results;
}

// Run validation if called directly
if (require.main === module) {
  validateDatabaseSetup()
    .then(results => {
      process.exit(results.valid ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation error:', error);
      process.exit(1);
    });
}

module.exports = { validateDatabaseSetup };
