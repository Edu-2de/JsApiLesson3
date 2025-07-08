import { Request, Response } from 'express';
import { TransactionController } from '../controllers/transactionController';
import pool from '../database/connection';

// Mock das dependências
jest.mock('../database/connection');

const mockPool = pool as any;

describe('TransactionController', () => {
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

  describe('addBalance', () => {
    it('should add balance successfully', async () => {
      const mockUser = { id: 1, balance: 100 };
      const mockTransaction = {
        id: 1,
        user_id: 1,
        type: 'credit',
        amount: 50,
        description: 'Adição de saldo',
        created_at: '2024-01-01'
      };

      mockReq.body = { user_id: 1, amount: 50, description: 'Test deposit' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [mockUser] }) // Get user
        .mockResolvedValueOnce({}) // Update balance
        .mockResolvedValueOnce({ rows: [mockTransaction] }); // Create transaction

      await TransactionController.addBalance(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Balance added successfully',
        transaction: mockTransaction,
        new_balance: 150
      });
    });

    it('should return 400 if user_id or amount is missing', async () => {
      mockReq.body = { amount: 50 }; // user_id missing

      await TransactionController.addBalance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User ID and positive amount are required' });
    });

    it('should return 400 if amount is negative', async () => {
      mockReq.body = { user_id: 1, amount: -50 };

      await TransactionController.addBalance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User ID and positive amount are required' });
    });

    it('should return 404 if user not found', async () => {
      mockReq.body = { user_id: 999, amount: 50 };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await TransactionController.addBalance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.body = { user_id: 1, amount: 50 };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await TransactionController.addBalance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error adding balance',
        error: 'Database error'
      });
    });
  });

  describe('getUserBalance', () => {
    it('should return user balance successfully', async () => {
      const mockUser = { 
        id: 1, 
        name: 'Test User', 
        email: 'test@test.com', 
        balance: 150.50 
      };

      mockReq.params = { user_id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      await TransactionController.getUserBalance(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Balance retrieved successfully',
        user: mockUser
      });
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { user_id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await TransactionController.getUserBalance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { user_id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await TransactionController.getUserBalance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching balance',
        error: 'Database error'
      });
    });
  });

  describe('getUserTransactions', () => {
    it('should return user transactions successfully', async () => {
      const mockTransactions = [
        {
          id: 1,
          user_id: 1,
          type: 'credit',
          amount: 100,
          description: 'Depósito inicial',
          created_at: '2024-01-01'
        },
        {
          id: 2,
          user_id: 1,
          type: 'debit',
          amount: 25,
          description: 'Compra de produto',
          created_at: '2024-01-02'
        }
      ];

      mockReq.params = { user_id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: mockTransactions });

      await TransactionController.getUserTransactions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Transactions retrieved successfully',
        transactions: mockTransactions
      });
    });

    it('should return empty array if no transactions found', async () => {
      mockReq.params = { user_id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await TransactionController.getUserTransactions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Transactions retrieved successfully',
        transactions: []
      });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { user_id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await TransactionController.getUserTransactions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching transactions',
        error: 'Database error'
      });
    });
  });
});
