import { Request, Response } from 'express';
import pool from '../database/connection';

export class UserController {
  // Listar todos os usuários
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');
      res.json({
        message: 'Users retrieved successfully',
        users: result.rows
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching users',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Buscar usuário por ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        message: 'User retrieved successfully',
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Criar novo usuário
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email and password are required' });
        return;
      }

      // Verificar se email já existe
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      // Inserir usuário (sem hash da senha por enquanto)
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, password]
      );

      res.status(201).json({
        message: 'User created successfully',
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Atualizar usuário
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      // Verificar se usuário existe
      const existingUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
      if (existingUser.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Atualizar usuário
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, updated_at',
        [name, email, id]
      );

      res.json({
        message: 'User updated successfully',
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Deletar usuário
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Verificar se usuário existe
      const existingUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
      if (existingUser.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Deletar usuário
      await pool.query('DELETE FROM users WHERE id = $1', [id]);

      res.json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}