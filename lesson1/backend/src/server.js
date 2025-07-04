const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar conexão do banco
const { testConnection, query } = require('./database/connection');

// Importar rotas
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para log das requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota para testar conexão com banco
app.get('/test-db', async (req, res) => {
    try {
        const result = await query('SELECT NOW() as current_time, VERSION() as version');
        res.json({
            status: 'success',
            message: 'Conexão com banco estabelecida!',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao conectar com o banco',
            error: error.message
        });
    }
});

// Usar as rotas organizadas
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada',
        path: req.originalUrl
    });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
    console.error('❌ Erro no servidor:', error);
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
});

// Inicializar servidor
const startServer = async () => {
    try {
        // Testar conexão com banco antes de iniciar
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Falha na conexão com banco. Verifique suas configurações.');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
            console.log(`🔍 Teste DB: http://localhost:${PORT}/test-db`);
            console.log(`📦 Categorias: http://localhost:${PORT}/api/categories`);
            console.log(`🛍️  Produtos: http://localhost:${PORT}/api/products`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

// Iniciar aplicação
startServer();