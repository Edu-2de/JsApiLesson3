import { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import pool from '../database/connection';

// Mock das dependências
jest.mock('../database/connection');

const mockPool = pool as any;

describe('UserController', () => {
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

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@test.com', created_at: '2024-01-01' },
        { id: 2, name: 'User 2', email: 'user2@test.com', created_at: '2024-01-02' }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockUsers });

      await UserController.getAllUsers(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Users retrieved successfully',
        users: mockUsers
      });
    });

    it('should return 500 on database error', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await UserController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching users',
        error: 'Database error'
      });
    });
  });

  describe('getUserById', () => {
    it('should return user by id successfully', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@test.com', created_at: '2024-01-01' };
      
      mockReq.params = { id: '1' };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      await UserController.getUserById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User retrieved successfully',
        user: mockUser
      });
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await UserController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await UserController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching user',
        error: 'Database error'
      });
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockNewUser = { id: 1, name: 'Test User', email: 'test@test.com', created_at: '2024-01-01' };
      
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing email
        .mockResolvedValueOnce({ rows: [mockNewUser] }); // Create user

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: mockNewUser
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com' }; // password missing

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email and password are required' });
    });

    it('should return 400 if email already exists', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123' };
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should return 500 on database error', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error creating user',
        error: 'Database error'
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUpdatedUser = { id: 1, name: 'Updated User', email: 'updated@test.com', updated_at: '2024-01-01' };
      
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated User', email: 'updated@test.com' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing user
        .mockResolvedValueOnce({ rows: [mockUpdatedUser] }); // Update user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: mockUpdatedUser
      });
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: '999' };
      mockReq.body = { name: 'Updated User', email: 'updated@test.com' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated User', email: 'updated@test.com' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error updating user',
        error: 'Database error'
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockReq.params = { id: '1' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing user
        .mockResolvedValueOnce({}); // Delete user

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User deleted successfully'
      });
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: '999' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      mockReq.params = { id: '1' };
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error deleting user',
        error: 'Database error'
      });
    });
  });
});
