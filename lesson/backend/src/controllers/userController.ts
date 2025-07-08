import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';

export class UserController {
  // Listar todos os usuários
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT id, name, email, role, balance, is_active, created_at FROM users ORDER BY created_at DESC');
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
      const result = await pool.query('SELECT id, name, email, role, balance, is_active, created_at FROM users WHERE id = $1', [id]);
      
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

  // Criar novo usuário (apenas admin pode criar e definir role)
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role = 'user' } = req.body;

      // Validação básica
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

      // Validar role
      if (role && !['user', 'admin'].includes(role)) {
        res.status(400).json({ message: 'Role must be either "user" or "admin"' });
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

      // Inserir usuário com role especificado
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, balance, created_at',
        [name, email, hashedPassword, role]
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
      const { name, email, role, is_active } = req.body;

      // Verificar se usuário existe
      const existingUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
      if (existingUser.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Validar role se fornecido
      if (role && !['user', 'admin'].includes(role)) {
        res.status(400).json({ message: 'Role must be either "user" or "admin"' });
        return;
      }

      // Validar email se fornecido
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.status(400).json({ message: 'Invalid email format' });
          return;
        }

        // Verificar se email já existe em outro usuário
        const emailExists = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
        if (emailExists.rows.length > 0) {
          res.status(400).json({ message: 'Email already exists' });
          return;
        }
      }

      // Construir query dinâmica baseada nos campos fornecidos
      const fieldsToUpdate = [];
      const values = [];
      let paramCounter = 1;

      if (name) {
        fieldsToUpdate.push(`name = $${paramCounter++}`);
        values.push(name);
      }
      if (email) {
        fieldsToUpdate.push(`email = $${paramCounter++}`);
        values.push(email);
      }
      if (role) {
        fieldsToUpdate.push(`role = $${paramCounter++}`);
        values.push(role);
      }
      if (typeof is_active === 'boolean') {
        fieldsToUpdate.push(`is_active = $${paramCounter++}`);
        values.push(is_active);
      }

      if (fieldsToUpdate.length === 0) {
        res.status(400).json({ message: 'No fields to update' });
        return;
      }

      fieldsToUpdate.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = $${paramCounter} RETURNING id, name, email, role, balance, is_active, updated_at`;

      const result = await pool.query(query, values);

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