import { Request, Response } from 'express';
import { ProductController } from '../controllers/productController';
import pool from '../database/connection';

// Mock das dependências
jest.mock('../database/connection');

const mockPool = pool as any;

describe('ProductController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10.99, category_name: 'Category 1', created_at: '2024-01-01' },
        { id: 2, name: 'Product 2', price: 20.99, category_name: 'Category 2', created_at: '2024-01-02' }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });

      await ProductController.getAllProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Products retrieved successfully',
        products: mockProducts
      });
    });

    it('should return 500 on database error', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await ProductController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching products',
        error: 'Database error'
      });
    });
  });

  describe('getProductById', () => {
    it('should return product by id successfully', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 10.99, description: 'Test description' };
      
      mockReq.params = { id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockProduct] });

      await ProductController.getProductById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Product retrieved successfully',
        product: mockProduct
      });
    });

    it('should return 404 if product not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await ProductController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await ProductController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching product',
        error: 'Database error'
      });
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const mockNewProduct = { 
        id: 1, 
        name: 'Test Product', 
        description: 'Test description',
        price: 10.99, 
        stock_quantity: 100,
        category_id: 1,
        created_at: '2024-01-01'
      };
      
      mockReq.body = { 
        name: 'Test Product', 
        description: 'Test description',
        price: 10.99, 
        stock_quantity: 100,
        category_id: 1
      };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check category exists
        .mockResolvedValueOnce({ rows: [mockNewProduct] }); // Create product

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Product created successfully',
        product: mockNewProduct
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { description: 'Test description' }; // name and price missing

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name and price are required' });
    });

    it('should return 400 if price is invalid', async () => {
      mockReq.body = { name: 'Test Product', price: -10 };

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Price must be a valid positive number' });
    });

    it('should return 404 if category not found', async () => {
      mockReq.body = { name: 'Test Product', price: 10.99, category_id: 999 };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.body = { name: 'Test Product', price: 10.99 };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await ProductController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error creating product',
        error: 'Database error'
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const mockUpdatedProduct = { 
        id: 1, 
        name: 'Updated Product', 
        description: 'Updated description',
        price: 15.99, 
        stock_quantity: 50,
        updated_at: '2024-01-01'
      };
      
      mockReq.params = { id: '1' };
      mockReq.body = { 
        name: 'Updated Product', 
        description: 'Updated description',
        price: 15.99, 
        stock_quantity: 50
      };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing product
        .mockResolvedValueOnce({ rows: [mockUpdatedProduct] }); // Update product

      await ProductController.updateProduct(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Product updated successfully',
        product: mockUpdatedProduct
      });
    });

    it('should return 404 if product not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { name: 'Updated Product', price: 15.99 };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await ProductController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 400 if price is invalid', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Product', price: -15 };
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await ProductController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Price must be a valid positive number' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Product', price: 15.99 };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await ProductController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error updating product',
        error: 'Database error'
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      mockReq.params = { id: '1' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing product
        .mockResolvedValueOnce({}); // Delete product

      await ProductController.deleteProduct(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Product deleted successfully'
      });
    });

    it('should return 404 if product not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await ProductController.deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await ProductController.deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error deleting product',
        error: 'Database error'
      });
    });
  });

  describe('searchProducts', () => {
    it('should search products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Laptop', price: 999.99, stock_quantity: 10 },
        { id: 2, name: 'Laptop Pro', price: 1299.99, stock_quantity: 5 }
      ];

      mockReq.query = { name: 'laptop', min_price: '500', max_price: '2000', in_stock: 'true' };
      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });

      await ProductController.searchProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Products retrieved successfully',
        products: mockProducts,
        total: 2
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.query = { name: 'laptop' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await ProductController.searchProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error searching products',
        error: 'Database error'
      });
    });
  });
});
