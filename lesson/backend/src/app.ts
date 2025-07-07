import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './database/connection';
import { setupDatabase, testConnection } from './database/setup';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';

// Middlewares personalizados
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimiter';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middlewares personalizados
app.use(logger);
app.use(rateLimit(100, 15 * 60 * 1000));

// Rota de teste básica
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Backend API'
  });
});

// Rota de teste do banco (apenas para debug)
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected!', 
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Inicializar servidor
async function startServer() {
  try {
    console.log('🔧 Starting server...');
    
    // 1. Testar conexão com banco
    await testConnection();
    console.log('✅ Database connection successful');
    
    // 2. Executar setup do banco (apenas uma vez)
    await setupDatabase();
    console.log('✅ Database setup completed');
    
    // 3. Registrar rotas DEPOIS do setup
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/products', productRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/transactions', transactionRoutes);
    
    // 4. Middleware de tratamento de erros (sempre por último)
    app.use(errorHandler);
    
    // 5. Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Test DB: http://localhost:${PORT}/test-db`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Inicializar servidor
startServer();