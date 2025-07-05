import { Request, Response } from 'express';
import pool from '../database/connection';

export class CategoryController {
  // Listar todas as categorias
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
      res.json({
        message: 'Categories retrieved successfully',
        categories: result.rows
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching categories',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Buscar categoria por ID
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      res.json({
        message: 'Category retrieved successfully',
        category: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching category',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Criar nova categoria
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({ message: 'Name is required' });
        return;
      }

      const result = await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
        [name, description || null]
      );

      res.status(201).json({
        message: 'Category created successfully',
        category: result.rows[0]
      });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === '23505') {
        res.status(400).json({ message: 'Category name already exists' });
        return;
      }
      res.status(500).json({
        message: 'Error creating category',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Atualizar categoria
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const existingCategory = await pool.query('SELECT id FROM categories WHERE id = $1', [id]);
      if (existingCategory.rows.length === 0) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      const result = await pool.query(
        'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [name, description, id]
      );

      res.json({
        message: 'Category updated successfully',
        category: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating category',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Deletar categoria
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const existingCategory = await pool.query('SELECT id FROM categories WHERE id = $1', [id]);
      if (existingCategory.rows.length === 0) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      await pool.query('DELETE FROM categories WHERE id = $1', [id]);

      res.json({
        message: 'Category deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting category',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Buscar produtos por categoria
  static async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        WHERE c.id = $1 
        ORDER BY p.name ASC
      `, [id]);

      res.json({
        message: 'Products retrieved successfully',
        products: result.rows
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching products by category',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}