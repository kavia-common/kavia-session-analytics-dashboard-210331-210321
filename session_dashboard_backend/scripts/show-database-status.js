#!/usr/bin/env node

// ============================================================================
// Database Status Display Script
// ============================================================================

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// PUBLIC_INTERFACE
/**
 * Display database setup status with visual indicators
 */
async function showDatabaseStatus() {
  console.log('\n' + '='.repeat(70));
  console.log('  📊 KAVIA SESSION ANALYTICS - DATABASE STATUS');
  console.log('='.repeat(70) + '\n');

  const checks = [];

  // Check 1: Docker Compose file
  try {
    const fs = require('fs');
    fs.accessSync('./docker-compose.yml');
    checks.push({ name: 'Docker Compose Config', status: '✅', detail: 'Found' });
  } catch {
    checks.push({ name: 'Docker Compose Config', status: '❌', detail: 'Missing' });
  }

  // Check 2: Migration files
  try {
    const fs = require('fs');
    const files = fs.readdirSync('./sql/migrations');
    const sqlFiles = files.filter(f => f.endsWith('.sql'));
    checks.push({ 
      name: 'Migration Files', 
      status: sqlFiles.length >= 10 ? '✅' : '⚠️', 
      detail: `${sqlFiles.length} files` 
    });
  } catch {
    checks.push({ name: 'Migration Files', status: '❌', detail: 'Not found' });
  }

  // Check 3: Seed data
  try {
    const fs = require('fs');
    fs.accessSync('./sql/seeds/seed_data.sql');
    checks.push({ name: 'Seed Data', status: '✅', detail: 'Ready' });
  } catch {
    checks.push({ name: 'Seed Data', status: '❌', detail: 'Missing' });
  }

  // Check 4: Documentation
  const docs = ['README_DATABASE.md', 'QUICKSTART_DATABASE.md', 'DATABASE_IMPLEMENTATION_SUMMARY.md'];
  let docCount = 0;
  docs.forEach(doc => {
    try {
      const fs = require('fs');
      fs.accessSync(`./${doc}`);
      docCount++;
    } catch {}
  });
  checks.push({ 
    name: 'Documentation', 
    status: docCount === docs.length ? '✅' : '⚠️', 
    detail: `${docCount}/${docs.length} files` 
  });

  // Check 5: PostgreSQL container
  try {
    const { stdout } = await execPromise('docker ps --filter "name=session_analytics_db" --format "{{.Status}}"');
    if (stdout.trim()) {
      checks.push({ name: 'PostgreSQL Container', status: '✅', detail: 'Running' });
    } else {
      checks.push({ name: 'PostgreSQL Container', status: '⏸️', detail: 'Stopped' });
    }
  } catch {
    checks.push({ name: 'PostgreSQL Container', status: '❌', detail: 'Not found' });
  }

  // Check 6: Node modules
  try {
    const fs = require('fs');
    fs.accessSync('./node_modules/pg');
    checks.push({ name: 'Dependencies', status: '✅', detail: 'Installed' });
  } catch {
    checks.push({ name: 'Dependencies', status: '❌', detail: 'Run npm install' });
  }

  // Print checks
  console.log('  COMPONENT STATUS:\n');
  checks.forEach(check => {
    const padding = ' '.repeat(35 - check.name.length);
    console.log(`    ${check.name}${padding}${check.status}  ${check.detail}`);
  });

  console.log('\n' + '-'.repeat(70) + '\n');

  // Overall status
  const allGood = checks.every(c => c.status === '✅');
  const hasWarnings = checks.some(c => c.status === '⚠️');
  const hasErrors = checks.some(c => c.status === '❌' || c.status === '⏸️');

  if (allGood) {
    console.log('  🎉 STATUS: ALL SYSTEMS READY\n');
    console.log('  Next steps:');
    console.log('    1. npm run db:start    (if PostgreSQL not running)');
    console.log('    2. npm run migrate     (to apply schema)');
    console.log('    3. npm run dev         (to start backend)\n');
  } else if (hasErrors) {
    console.log('  ⚠️  STATUS: ACTION REQUIRED\n');
    console.log('  Please address the issues above.\n');
    console.log('  Quick fixes:');
    if (checks.find(c => c.name === 'Dependencies' && c.status === '❌')) {
      console.log('    - Run: npm install');
    }
    if (checks.find(c => c.name === 'PostgreSQL Container' && c.status !== '✅')) {
      console.log('    - Run: npm run db:start');
    }
    console.log('\n  For help, see: QUICKSTART_DATABASE.md\n');
  } else if (hasWarnings) {
    console.log('  ⚠️  STATUS: MOSTLY READY (with warnings)\n');
    console.log('  System is functional but some optional components missing.\n');
  }

  console.log('  USEFUL COMMANDS:\n');
  console.log('    npm run db:validate   - Full validation check');
  console.log('    npm run db:start      - Start PostgreSQL');
  console.log('    npm run db:logs       - View database logs');
  console.log('    npm run db:shell      - Access database CLI');
  console.log('    npm run migrate       - Run migrations');
  console.log('    npm test              - Run test suite\n');

  console.log('  DOCUMENTATION:\n');
  console.log('    📖 QUICKSTART_DATABASE.md           - 5-minute setup');
  console.log('    📖 README_DATABASE.md               - Complete reference');
  console.log('    📖 DATABASE_IMPLEMENTATION_SUMMARY  - Implementation details');
  console.log('    📖 DEPLOYMENT_CHECKLIST.md          - Production deployment\n');

  console.log('='.repeat(70) + '\n');

  return checks;
}

// Run if called directly
if (require.main === module) {
  showDatabaseStatus().catch(error => {
    console.error('Error displaying status:', error.message);
    process.exit(1);
  });
}

module.exports = { showDatabaseStatus };
