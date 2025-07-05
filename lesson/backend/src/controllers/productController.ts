import { Request, Response } from 'express';
import pool from '../database/connection';

export class ProductController {
  // Listar todos os produtos
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      res.json({
        message: 'Products retrieved successfully',
        products: result.rows
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Buscar produto por ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.json({
        message: 'Product retrieved successfully',
        product: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching product',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Criar novo produto
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, price, stock_quantity } = req.body;

      // Validação básica
      if (!name || !price) {
        res.status(400).json({ message: 'Name and price are required' });
        return;
      }

      // Validar se o preço é um número válido
      if (isNaN(price) || price <= 0) {
        res.status(400).json({ message: 'Price must be a valid positive number' });
        return;
      }

      // Inserir produto
      const result = await pool.query(
        'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description || null, price, stock_quantity || 0]
      );

      res.status(201).json({
        message: 'Product created successfully',
        product: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating product',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Atualizar produto
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, price, stock_quantity } = req.body;

      // Verificar se produto existe
      const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
      if (existingProduct.rows.length === 0) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      // Validar preço se fornecido
      if (price && (isNaN(price) || price <= 0)) {
        res.status(400).json({ message: 'Price must be a valid positive number' });
        return;
      }

      // Atualizar produto
      const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [name, description, price, stock_quantity, id]
      );

      res.json({
        message: 'Product updated successfully',
        product: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating product',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Deletar produto
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Verificar se produto existe
      const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
      if (existingProduct.rows.length === 0) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      // Deletar produto
      await pool.query('DELETE FROM products WHERE id = $1', [id]);

      res.json({
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting product',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Buscar produtos por filtros
  static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { name, min_price, max_price, in_stock } = req.query;

      let query = 'SELECT * FROM products WHERE 1=1';
      let params: any[] = [];
      let paramCount = 0;

      // Filtrar por nome
      if (name) {
        paramCount++;
        query += ` AND name ILIKE $${paramCount}`;
        params.push(`%${name}%`);
      }

      // Filtrar por preço mínimo
      if (min_price) {
        paramCount++;
        query += ` AND price >= $${paramCount}`;
        params.push(min_price);
      }

      // Filtrar por preço máximo
      if (max_price) {
        paramCount++;
        query += ` AND price <= $${paramCount}`;
        params.push(max_price);
      }

      // Filtrar apenas produtos em estoque
      if (in_stock === 'true') {
        query += ` AND stock_quantity > 0`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      res.json({
        message: 'Products retrieved successfully',
        products: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error searching products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}