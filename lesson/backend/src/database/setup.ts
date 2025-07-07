// src/database/setup.ts
import pool from './connection';
import fs from 'fs';
import path from 'path';

// Variável para controlar se o setup já foi executado
let setupExecuted = false;

export async function setupDatabase() {
  // Se já foi executado, não executa novamente
  if (setupExecuted) {
    console.log('⏭️ Database setup already completed, skipping...');
    return;
  }
  
  try {
    console.log('🔧 Setting up database...');
    
    // Verificar se as tabelas já existem
    const tablesExist = await checkIfTablesExist();
    if (tablesExist) {
      console.log('✅ Database tables already exist, skipping setup...');
      setupExecuted = true;
      return;
    }
    
    // Ler e executar schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Executar o schema
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');
    
    // Marcar como executado
    setupExecuted = true;
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    // Se deu erro, mas as tabelas já existem, não é um problema crítico
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('⚠️ Tables already exist, continuing...');
      setupExecuted = true;
      return;
    }
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

// Função auxiliar para verificar se as tabelas existem
async function checkIfTablesExist() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    return false;
  }
}