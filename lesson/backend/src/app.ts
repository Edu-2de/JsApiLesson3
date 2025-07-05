import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './database/connection';
import { setupDatabase, testConnection } from './database/setup';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Rota de teste do banco
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

// Rota para setup do banco (usar apenas em desenvolvimento)
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

// Inicializar servidor
async function startServer() {
  try {
    // Testar conexão com o banco
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