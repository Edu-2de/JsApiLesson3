import { Request, Response } from 'express';
import { PurchaseController } from '../controllers/purchaseController';
import pool from '../database/connection';

// Mock das dependências
jest.mock('../database/connection');

const mockPool = pool as any;

describe('PurchaseController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockClient: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 1, email: 'test@test.com', role: 'user' }
    };
    
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };

    mockPool.connect = jest.fn().mockResolvedValue(mockClient);

    jest.clearAllMocks();
  });

  describe('makePurchase', () => {
    it('should complete purchase successfully', async () => {
      const mockUser = { id: 1, balance: 1000 };
      const mockProduct = { 
        id: 1, 
        name: 'Test Product', 
        price: 100, 
        stock_quantity: 50 
      };
      const mockOrder = {
        id: 1,
        user_id: 1,
        total_amount: 200,
        status: 'confirmed',
        created_at: '2024-01-01'
      };

      mockReq.body = {
        items: [
          { product_id: 1, quantity: 2 }
        ]
      };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [mockUser] }) // Get user
        .mockResolvedValueOnce({ rows: [mockProduct] }) // Get product
        .mockResolvedValueOnce({ rows: [mockOrder] }) // Create order
        .mockResolvedValueOnce({ rows: [{ price: 100 }] }) // Get product price
        .mockResolvedValueOnce({}) // Insert order item
        .mockResolvedValueOnce({}) // Update stock
        .mockResolvedValueOnce({}) // Update balance
        .mockResolvedValueOnce({}) // Create transaction
        .mockResolvedValueOnce({}); // COMMIT

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Purchase completed successfully',
        order: mockOrder,
        new_balance: 800
      });
    });

    it('should return 400 if items array is missing', async () => {
      mockReq.body = {};

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Items array is required' });
    });

    it('should return 400 if items array is empty', async () => {
      mockReq.body = { items: [] };

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Items array is required' });
    });

    it('should return 404 if user not found', async () => {
      mockReq.body = { items: [{ product_id: 1, quantity: 2 }] };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [] }); // Get user - not found

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 404 if product not found', async () => {
      const mockUser = { id: 1, balance: 1000 };

      mockReq.body = { items: [{ product_id: 999, quantity: 2 }] };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [mockUser] }) // Get user
        .mockResolvedValueOnce({ rows: [] }); // Get product - not found

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product with ID 999 not found' });
    });

    it('should return 400 if insufficient stock', async () => {
      const mockUser = { id: 1, balance: 1000 };
      const mockProduct = { 
        id: 1, 
        name: 'Test Product', 
        price: 100, 
        stock_quantity: 1 
      };

      mockReq.body = { items: [{ product_id: 1, quantity: 5 }] };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [mockUser] }) // Get user
        .mockResolvedValueOnce({ rows: [mockProduct] }); // Get product

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Insufficient stock for product Test Product. Available: 1, Requested: 5' 
      });
    });

    it('should return 400 if insufficient balance', async () => {
      const mockUser = { id: 1, balance: 50 };
      const mockProduct = { 
        id: 1, 
        name: 'Test Product', 
        price: 100, 
        stock_quantity: 50 
      };

      mockReq.body = { items: [{ product_id: 1, quantity: 2 }] };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [mockUser] }) // Get user
        .mockResolvedValueOnce({ rows: [mockProduct] }); // Get product

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Insufficient balance',
        current_balance: 50,
        required_amount: 200
      });
    });

    it('should rollback on error', async () => {
      mockReq.body = { items: [{ product_id: 1, quantity: 2 }] };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error('Database error')); // Get user fails

      await PurchaseController.makePurchase(mockReq, mockRes);

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error processing purchase',
        error: 'Database error'
      });
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders successfully', async () => {
      const mockOrders = [
        {
          id: 1,
          user_id: 1,
          total_amount: 200,
          status: 'confirmed',
          created_at: '2024-01-01',
          items: [
            {
              product_id: 1,
              product_name: 'Test Product',
              quantity: 2,
              price: 100
            }
          ]
        }
      ];

      mockReq.params = { user_id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: mockOrders });

      await PurchaseController.getUserOrders(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Orders retrieved successfully',
        orders: mockOrders
      });
    });

    it('should return empty array if no orders found', async () => {
      mockReq.params = { user_id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await PurchaseController.getUserOrders(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Orders retrieved successfully',
        orders: []
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { user_id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await PurchaseController.getUserOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching orders',
        error: 'Database error'
      });
    });
  });
});
