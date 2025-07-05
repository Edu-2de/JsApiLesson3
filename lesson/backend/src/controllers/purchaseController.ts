import { Request, Response } from 'express';
import pool from '../database/connection';

export class PurchaseController {
  // Realizar compra
  static async makePurchase(req: Request, res: Response): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const { user_id, items } = req.body; // items = [{ product_id, quantity }]

      if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: 'User ID and items array are required' });
        return;
      }

      // Verificar se usuário existe
      const userResult = await client.query('SELECT id, balance FROM users WHERE id = $1', [user_id]);
      if (userResult.rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userBalance = parseFloat(userResult.rows[0].balance);
      let totalAmount = 0;

      // Verificar produtos e calcular total
      for (const item of items) {
        const productResult = await client.query(
          'SELECT id, name, price, stock_quantity FROM products WHERE id = $1',
          [item.product_id]
        );

        if (productResult.rows.length === 0) {
          res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
          return;
        }

        const product = productResult.rows[0];
        
        if (product.stock_quantity < item.quantity) {
          res.status(400).json({ 
            message: `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}` 
          });
          return;
        }

        totalAmount += parseFloat(product.price) * item.quantity;
      }

      // Verificar se usuário tem saldo suficiente
      if (userBalance < totalAmount) {
        res.status(400).json({ 
          message: 'Insufficient balance',
          current_balance: userBalance,
          required_amount: totalAmount
        });
        return;
      }

      // Criar pedido
      const orderResult = await client.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
        [user_id, totalAmount, 'confirmed']
      );

      const orderId = orderResult.rows[0].id;

      // Adicionar itens ao pedido e atualizar estoque
      for (const item of items) {
        const productResult = await client.query(
          'SELECT price FROM products WHERE id = $1',
          [item.product_id]
        );

        const itemPrice = parseFloat(productResult.rows[0].price);

        // Inserir item do pedido
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.product_id, item.quantity, itemPrice]
        );

        // Atualizar estoque
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      // Debitar saldo do usuário
      const newBalance = userBalance - totalAmount;
      await client.query(
        'UPDATE users SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newBalance, user_id]
      );

      // Registrar transação
      await client.query(
        'INSERT INTO transactions (user_id, type, amount, description, order_id) VALUES ($1, $2, $3, $4, $5)',
        [user_id, 'debit', totalAmount, 'Compra de produtos', orderId]
      );

      await client.query('COMMIT');

      res.json({
        message: 'Purchase completed successfully',
        order: orderResult.rows[0],
        new_balance: newBalance
      });

    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({
        message: 'Error processing purchase',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      client.release();
    }
  }

  // Listar pedidos do usuário
  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const result = await pool.query(`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'product_id', oi.product_id,
                   'product_name', p.name,
                   'quantity', oi.quantity,
                   'price', oi.price
                 )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `, [user_id]);

      res.json({
        message: 'Orders retrieved successfully',
        orders: result.rows
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching orders',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}