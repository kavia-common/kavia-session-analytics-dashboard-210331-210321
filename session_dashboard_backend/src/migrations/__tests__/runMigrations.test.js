// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-TEST-DB-001
// User Story: Unit tests for database migration runner
// GxP Impact: YES - Validates migration system for GxP data
// Risk Level: HIGH
// ============================================================================

const fs = require('fs').promises;
const path = require('path');
const { loadMigrationFiles } = require('../runMigrations');

describe('Database Migration System', () => {
  
  // ============================================================================
  // MIGRATION FILE LOADING TESTS
  // ============================================================================
  
  describe('loadMigrationFiles', () => {
    
    test('should load all SQL migration files from directory', async () => {
      const migrations = await loadMigrationFiles();
      
      expect(migrations).toBeDefined();
      expect(Array.isArray(migrations)).toBe(true);
      expect(migrations.length).toBeGreaterThanOrEqual(10);
    });
    
    test('should parse migration IDs correctly', async () => {
      const migrations = await loadMigrationFiles();
      
      migrations.forEach(migration => {
        expect(migration.id).toBeDefined();
        expect(typeof migration.id).toBe('number');
        expect(migration.id).toBeGreaterThan(0);
      });
    });
    
    test('should parse migration names correctly', async () => {
      const migrations = await loadMigrationFiles();
      
      migrations.forEach(migration => {
        expect(migration.name).toBeDefined();
        expect(typeof migration.name).toBe('string');
        expect(migration.name.length).toBeGreaterThan(0);
      });
    });
    
    test('should include filename for each migration', async () => {
      const migrations = await loadMigrationFiles();
      
      migrations.forEach(migration => {
        expect(migration.filename).toBeDefined();
        expect(migration.filename).toMatch(/^\d{3}_.*\.sql$/);
      });
    });
    
    test('should include SQL content for each migration', async () => {
      const migrations = await loadMigrationFiles();
      
      migrations.forEach(migration => {
        expect(migration.content).toBeDefined();
        expect(typeof migration.content).toBe('string');
        expect(migration.content.length).toBeGreaterThan(0);
      });
    });
    
    test('should calculate checksum for each migration', async () => {
      const migrations = await loadMigrationFiles();
      
      migrations.forEach(migration => {
        expect(migration.checksum).toBeDefined();
        expect(typeof migration.checksum).toBe('string');
        expect(migration.checksum).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex
      });
    });
    
    test('should sort migrations by ID in ascending order', async () => {
      const migrations = await loadMigrationFiles();
      
      for (let i = 1; i < migrations.length; i++) {
        expect(migrations[i].id).toBeGreaterThan(migrations[i - 1].id);
      }
    });
  });
  
  // ============================================================================
  // MIGRATION FILE CONTENT VALIDATION
  // ============================================================================
  
  describe('Migration File Content Validation', () => {
    
    test('001_create_users_table.sql should create users table', async () => {
      const migrations = await loadMigrationFiles();
      const usersMigration = migrations.find(m => m.id === 1);
      
      expect(usersMigration).toBeDefined();
      expect(usersMigration.content).toContain('CREATE TABLE');
      expect(usersMigration.content).toContain('users');
      expect(usersMigration.content).toContain('username');
      expect(usersMigration.content).toContain('email');
      expect(usersMigration.content).toContain('password_hash');
      expect(usersMigration.content).toContain('role');
    });
    
    test('002_create_teams_table.sql should create teams table', async () => {
      const migrations = await loadMigrationFiles();
      const teamsMigration = migrations.find(m => m.id === 2);
      
      expect(teamsMigration).toBeDefined();
      expect(teamsMigration.content).toContain('CREATE TABLE');
      expect(teamsMigration.content).toContain('teams');
      expect(teamsMigration.content).toContain('name');
      expect(teamsMigration.content).toContain('manager_id');
    });
    
    test('003_create_sessions_table.sql should create sessions table', async () => {
      const migrations = await loadMigrationFiles();
      const sessionsMigration = migrations.find(m => m.id === 3);
      
      expect(sessionsMigration).toBeDefined();
      expect(sessionsMigration.content).toContain('CREATE TABLE');
      expect(sessionsMigration.content).toContain('sessions');
      expect(sessionsMigration.content).toContain('session_id');
      expect(sessionsMigration.content).toContain('user_id');
      expect(sessionsMigration.content).toContain('agents_used');
      expect(sessionsMigration.content).toContain('features_used');
      expect(sessionsMigration.content).toContain('token_usage');
    });
    
    test('005_create_roles_table.sql should create roles table', async () => {
      const migrations = await loadMigrationFiles();
      const rolesMigration = migrations.find(m => m.id === 5);
      
      expect(rolesMigration).toBeDefined();
      expect(rolesMigration.content).toContain('CREATE TABLE');
      expect(rolesMigration.content).toContain('roles');
      expect(rolesMigration.content).toContain('role_name');
      expect(rolesMigration.content).toContain('permissions');
      expect(rolesMigration.content).toContain('hierarchy_level');
    });
    
    test('006_create_audit_logs_table.sql should create audit_logs table', async () => {
      const migrations = await loadMigrationFiles();
      const auditMigration = migrations.find(m => m.id === 6);
      
      expect(auditMigration).toBeDefined();
      expect(auditMigration.content).toContain('CREATE TABLE');
      expect(auditMigration.content).toContain('audit_logs');
      expect(auditMigration.content).toContain('timestamp');
      expect(auditMigration.content).toContain('user_id');
      expect(auditMigration.content).toContain('action_type');
      expect(auditMigration.content).toContain('old_values');
      expect(auditMigration.content).toContain('new_values');
    });
    
    test('007_create_signatures_table.sql should create electronic_signatures table', async () => {
      const migrations = await loadMigrationFiles();
      const signaturesMigration = migrations.find(m => m.id === 7);
      
      expect(signaturesMigration).toBeDefined();
      expect(signaturesMigration.content).toContain('CREATE TABLE');
      expect(signaturesMigration.content).toContain('electronic_signatures');
      expect(signaturesMigration.content).toContain('signature_id');
      expect(signaturesMigration.content).toContain('data_hash');
      expect(signaturesMigration.content).toContain('password_verified');
    });
  });
  
  // ============================================================================
  // INDEX VALIDATION
  // ============================================================================
  
  describe('Index Creation Validation', () => {
    
    test('users table migration should create indexes', async () => {
      const migrations = await loadMigrationFiles();
      const usersMigration = migrations.find(m => m.id === 1);
      
      expect(usersMigration.content).toContain('CREATE INDEX');
      expect(usersMigration.content).toContain('idx_users_username');
      expect(usersMigration.content).toContain('idx_users_email');
      expect(usersMigration.content).toContain('idx_users_role');
    });
    
    test('sessions table migration should create indexes', async () => {
      const migrations = await loadMigrationFiles();
      const sessionsMigration = migrations.find(m => m.id === 3);
      
      expect(sessionsMigration.content).toContain('CREATE INDEX');
      expect(sessionsMigration.content).toContain('idx_sessions_user_id');
      expect(sessionsMigration.content).toContain('idx_sessions_session_id');
    });
    
    test('audit_logs table migration should create indexes', async () => {
      const migrations = await loadMigrationFiles();
      const auditMigration = migrations.find(m => m.id === 6);
      
      expect(auditMigration.content).toContain('CREATE INDEX');
      expect(auditMigration.content).toContain('idx_audit_timestamp');
      expect(auditMigration.content).toContain('idx_audit_user_id');
    });
  });
  
  // ============================================================================
  // GXP COMPLIANCE VALIDATION
  // ============================================================================
  
  describe('GxP Compliance Features', () => {
    
    test('should have requirement traceability comments', async () => {
      const migrations = await loadMigrationFiles();
      
      migrations.forEach(migration => {
        expect(migration.content).toContain('REQUIREMENT TRACEABILITY');
        expect(migration.content).toContain('Requirement ID:');
      });
    });
    
    test('audit_logs should support ALCOA+ principles', async () => {
      const migrations = await loadMigrationFiles();
      const auditMigration = migrations.find(m => m.id === 6);
      
      // Attributable - user tracking
      expect(auditMigration.content).toContain('user_id');
      expect(auditMigration.content).toContain('username');
      
      // Contemporaneous - timestamp
      expect(auditMigration.content).toContain('timestamp');
      
      // Original - preserve old values
      expect(auditMigration.content).toContain('old_values');
      expect(auditMigration.content).toContain('new_values');
      
      // Complete - comprehensive logging
      expect(auditMigration.content).toContain('action_description');
      expect(auditMigration.content).toContain('reason_for_change');
    });
    
    test('electronic_signatures should support 21 CFR Part 11', async () => {
      const migrations = await loadMigrationFiles();
      const signaturesMigration = migrations.find(m => m.id === 7);
      
      expect(signaturesMigration.content).toContain('signature_id');
      expect(signaturesMigration.content).toContain('signature_meaning');
      expect(signaturesMigration.content).toContain('data_hash');
      expect(signaturesMigration.content).toContain('password_verified');
      expect(signaturesMigration.content).toContain('timestamp');
    });
    
    test('should have audit trail for role changes', async () => {
      const migrations = await loadMigrationFiles();
      const roleChangeMigration = migrations.find(m => m.id === 9);
      
      expect(roleChangeMigration).toBeDefined();
      expect(roleChangeMigration.content).toContain('role_change_logs');
      expect(roleChangeMigration.content).toContain('old_role');
      expect(roleChangeMigration.content).toContain('new_role');
      expect(roleChangeMigration.content).toContain('changed_by');
      expect(roleChangeMigration.content).toContain('reason');
    });
  });
  
  // ============================================================================
  // SEED DATA VALIDATION
  // ============================================================================
  
  describe('Seed Data Validation', () => {
    
    test('seed_data.sql should exist', async () => {
      const seedPath = path.join(__dirname, '../../../sql/seeds/seed_data.sql');
      await expect(fs.access(seedPath)).resolves.not.toThrow();
    });
    
    test('seed_data.sql should include default roles', async () => {
      const seedPath = path.join(__dirname, '../../../sql/seeds/seed_data.sql');
      const content = await fs.readFile(seedPath, 'utf8');
      
      expect(content).toContain('INSERT INTO roles');
      expect(content).toContain('Admin');
      expect(content).toContain('Manager');
      expect(content).toContain('Engineer');
      expect(content).toContain('Viewer');
    });
    
    test('seed_data.sql should include default admin user', async () => {
      const seedPath = path.join(__dirname, '../../../sql/seeds/seed_data.sql');
      const content = await fs.readFile(seedPath, 'utf8');
      
      expect(content).toContain('INSERT INTO users');
      expect(content).toContain('admin');
      expect(content).toContain('admin@kavia.ai');
    });
    
    test('seed_data.sql should include default features', async () => {
      const seedPath = path.join(__dirname, '../../../sql/seeds/seed_data.sql');
      const content = await fs.readFile(seedPath, 'utf8');
      
      expect(content).toContain('INSERT INTO features');
      expect(content).toContain('CODE_GENERATION');
      expect(content).toContain('CODE_REVIEW');
    });
  });
  
  // ============================================================================
  // DOCUMENTATION VALIDATION
  // ============================================================================
  
  describe('Documentation Validation', () => {
    
    test('README_DATABASE.md should exist', async () => {
      const readmePath = path.join(__dirname, '../../../README_DATABASE.md');
      await expect(fs.access(readmePath)).resolves.not.toThrow();
    });
    
    test('QUICKSTART_DATABASE.md should exist', async () => {
      const quickstartPath = path.join(__dirname, '../../../QUICKSTART_DATABASE.md');
      await expect(fs.access(quickstartPath)).resolves.not.toThrow();
    });
    
    test('docker-compose.yml should exist', async () => {
      const dockerPath = path.join(__dirname, '../../../docker-compose.yml');
      await expect(fs.access(dockerPath)).resolves.not.toThrow();
    });
  });
});
