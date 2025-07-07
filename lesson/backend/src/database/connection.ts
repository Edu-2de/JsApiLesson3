// src/database/connection.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carregar .env PRIMEIRO
dotenv.config();

console.log('🔍 Database config:', {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'lesson',
  port: process.env.DB_PORT || '5432'
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'lesson',
  password: process.env.DB_PASSWORD || '@senac2025',
  port: parseInt(process.env.DB_PORT || '5432')
});

// Apenas logs de conexão, SEM executar setup aqui
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export default pool;