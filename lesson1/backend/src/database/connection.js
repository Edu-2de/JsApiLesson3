const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: process.env.DB_MAX_CONNECTIONS || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Função para testar a conexão
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
        console.log('🕐 Hora do servidor:', result.rows[0].now);
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
        return false;
    }
};

// Função para executar queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('🔍 Query executada:', { text, duration: `${duration}ms`, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Erro na query:', error.message);
        throw error;
    }
};

// Função para obter cliente do pool (para transações)
const getClient = async () => {
    return await pool.connect();
};

module.exports = {
    query,
    getClient,
    testConnection,
    pool
};