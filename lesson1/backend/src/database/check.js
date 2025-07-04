const { query } = require('./connection');

const checkTables = async () => {
    try {
        console.log('🔍 Verificando tabelas criadas...');
        
        // Listar todas as tabelas
        const tables = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('📋 Tabelas encontradas:');
        tables.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });
        
        // Verificar dados iniciais
        const categories = await query('SELECT COUNT(*) FROM categories');
        const users = await query('SELECT COUNT(*) FROM users');
        
        console.log('\n📊 Dados iniciais:');
        console.log(`   📦 Categorias: ${categories.rows[0].count}`);
        console.log(`   👥 Usuários: ${users.rows[0].count}`);
        
    } catch (error) {
        console.error('❌ Erro ao verificar tabelas:', error.message);
    }
};

// Executar se chamado diretamente
if (require.main === module) {
    checkTables();
}

module.exports = { checkTables };
