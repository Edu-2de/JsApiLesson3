const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração do pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const runMigrations = async () => {
    try {
        console.log('🚀 Iniciando execução do schema...');
        
        // Ler o arquivo schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Executar o schema
        await pool.query(schema);
        
        console.log('✅ Schema executado com sucesso!');
        console.log('📋 Tabelas criadas:');
        console.log('   - users');
        console.log('   - categories');
        console.log('   - products');
        console.log('   - orders');
        console.log('   - order_items');
        console.log('   - reviews');
        console.log('🎯 Dados iniciais inseridos!');
        
    } catch (error) {
        console.error('❌ Erro ao executar schema:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

// Executar se chamado diretamente
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };
