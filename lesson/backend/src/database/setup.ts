import pool from './connection';
import fs from 'fs';
import path from 'path';

export async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Ler e executar schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    throw error;
  }
}

export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}