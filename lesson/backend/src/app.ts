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

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);

// Rotas públicas para testes
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

app.post('/setup-db', async (req, res) => {
  try {
    await setupDatabase();
    res.json({ message: 'Database setup completed successfully!' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database setup failed', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializar servidor
async function startServer() {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();