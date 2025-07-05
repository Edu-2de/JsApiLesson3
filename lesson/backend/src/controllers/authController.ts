import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

export class AuthController {
  // Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      // Buscar usuário
      const result = await pool.query(
        'SELECT id, name, email, password_hash, role, balance, is_active FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const user = result.rows[0];

      // Verificar se usuário está ativo
      if (!user.is_active) {
        res.status(401).json({ message: 'Account is inactive' });
        return;
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Gerar token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during login',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Register
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email and password are required' });
        return;
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }

      // Validar senha
      if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long' });
        return;
      }

      // Verificar se email já existe
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Criar usuário
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, balance',
        [name, email, hashedPassword, 'user']
      );

      const newUser = result.rows[0];

      // Gerar token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          balance: newUser.balance
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error during registration',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Get profile
  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        'SELECT id, name, email, role, balance, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        message: 'Profile retrieved successfully',
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching profile',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}