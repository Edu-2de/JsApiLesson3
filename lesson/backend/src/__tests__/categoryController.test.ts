import { Request, Response } from 'express';
import { CategoryController } from '../controllers/categoryController';
import pool from '../database/connection';

// Mock das dependências
jest.mock('../database/connection');

const mockPool = pool as any;

describe('CategoryController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {}
    };
    
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics', description: 'Electronic devices' },
        { id: 2, name: 'Books', description: 'Books and literature' }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockCategories });

      await CategoryController.getAllCategories(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Categories retrieved successfully',
        categories: mockCategories
      });
    });

    it('should return 500 on database error', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await CategoryController.getAllCategories(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching categories',
        error: 'Database error'
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id successfully', async () => {
      const mockCategory = { id: 1, name: 'Electronics', description: 'Electronic devices' };
      
      mockReq.params = { id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockCategory] });

      await CategoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Category retrieved successfully',
        category: mockCategory
      });
    });

    it('should return 404 if category not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await CategoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await CategoryController.getCategoryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching category',
        error: 'Database error'
      });
    });
  });

  describe('createCategory', () => {
    it('should create category successfully', async () => {
      const mockNewCategory = { 
        id: 1, 
        name: 'Electronics', 
        description: 'Electronic devices',
        created_at: '2024-01-01'
      };
      
      mockReq.body = { name: 'Electronics', description: 'Electronic devices' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockNewCategory] });

      await CategoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Category created successfully',
        category: mockNewCategory
      });
    });

    it('should return 400 if name is missing', async () => {
      mockReq.body = { description: 'Electronic devices' }; // name missing

      await CategoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name is required' });
    });

    it('should return 400 if category name already exists', async () => {
      mockReq.body = { name: 'Electronics', description: 'Electronic devices' };
      const duplicateError = { code: '23505' }; // PostgreSQL unique violation
      mockPool.query.mockRejectedValueOnce(duplicateError);

      await CategoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Category name already exists' });
    });

    it('should return 500 on database error', async () => {
      mockReq.body = { name: 'Electronics', description: 'Electronic devices' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await CategoryController.createCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error creating category',
        error: 'Database error'
      });
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const mockUpdatedCategory = { 
        id: 1, 
        name: 'Updated Electronics', 
        description: 'Updated electronic devices',
        updated_at: '2024-01-01'
      };
      
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Electronics', description: 'Updated electronic devices' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing category
        .mockResolvedValueOnce({ rows: [mockUpdatedCategory] }); // Update category

      await CategoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Category updated successfully',
        category: mockUpdatedCategory
      });
    });

    it('should return 404 if category not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { name: 'Updated Electronics', description: 'Updated description' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await CategoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Electronics', description: 'Updated description' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await CategoryController.updateCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error updating category',
        error: 'Database error'
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      mockReq.params = { id: '1' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing category
        .mockResolvedValueOnce({}); // Delete category

      await CategoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Category deleted successfully'
      });
    });

    it('should return 404 if category not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await CategoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await CategoryController.deleteCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error deleting category',
        error: 'Database error'
      });
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Laptop', price: 999.99, category_name: 'Electronics' },
        { id: 2, name: 'Phone', price: 599.99, category_name: 'Electronics' }
      ];

      mockReq.params = { id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });

      await CategoryController.getProductsByCategory(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Products retrieved successfully',
        products: mockProducts
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await CategoryController.getProductsByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching products by category',
        error: 'Database error'
      });
    });
  });
});
