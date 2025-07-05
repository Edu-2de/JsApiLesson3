import { Request, Response } from 'express';
import pool from '../database/connection';

export class TransactionController {
  // Adicionar saldo ao usuário
  static async addBalance(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, amount, description } = req.body;

      if (!user_id || !amount || amount <= 0) {
        res.status(400).json({ message: 'User ID and positive amount are required' });
        return;
      }

      // Verificar se usuário existe
      const userResult = await pool.query('SELECT id, balance FROM users WHERE id = $1', [user_id]);
      if (userResult.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Atualizar saldo do usuário
      const newBalance = parseFloat(userResult.rows[0].balance) + parseFloat(amount);
      await pool.query('UPDATE users SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newBalance, user_id]);

      // Registrar transação
      const transactionResult = await pool.query(
        'INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, 'credit', amount, description || 'Adição de saldo']
      );

      res.json({
        message: 'Balance added successfully',
        transaction: transactionResult.rows[0],
        new_balance: newBalance
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error adding balance',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Consultar saldo do usuário
  static async getUserBalance(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const result = await pool.query('SELECT id, name, email, balance FROM users WHERE id = $1', [user_id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        message: 'Balance retrieved successfully',
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching balance',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Histórico de transações do usuário
  static async getUserTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const result = await pool.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
        [user_id]
      );

      res.json({
        message: 'Transactions retrieved successfully',
        transactions: result.rows
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching transactions',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}