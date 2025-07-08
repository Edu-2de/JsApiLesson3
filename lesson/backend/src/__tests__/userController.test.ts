import { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import pool from '../database/connection';
import bcrypt from 'bcryptjs';

// Mock das dependências
jest.mock('../database/connection');
jest.mock('bcryptjs');

const mockPool = pool as any;
const mockBcrypt = bcrypt as any;

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
        { id: 1, name: 'User 1', email: 'user1@test.com', role: 'user', balance: 0, is_active: true, created_at: '2024-01-01' },
        { id: 2, name: 'Admin User', email: 'admin@test.com', role: 'admin', balance: 1000, is_active: true, created_at: '2024-01-02' }
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
      const mockUser = { id: 1, name: 'Test User', email: 'test@test.com', role: 'user', balance: 100, is_active: true, created_at: '2024-01-01' };
      
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
    it('should create user successfully with default role', async () => {
      const mockNewUser = { id: 1, name: 'Test User', email: 'test@test.com', role: 'user', balance: 0, created_at: '2024-01-01' };
      
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing email
        .mockResolvedValueOnce({ rows: [mockNewUser] }); // Create user

      mockBcrypt.hash.mockResolvedValueOnce('hashedPassword');

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: mockNewUser
      });
    });

    it('should create admin user when role is specified', async () => {
      const mockNewAdmin = { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin', balance: 0, created_at: '2024-01-01' };
      
      mockReq.body = { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing email
        .mockResolvedValueOnce({ rows: [mockNewAdmin] }); // Create user

      mockBcrypt.hash.mockResolvedValueOnce('hashedPassword');

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: mockNewAdmin
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com' }; // password missing

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email and password are required' });
    });

    it('should return 400 if email format is invalid', async () => {
      mockReq.body = { name: 'Test User', email: 'invalid-email', password: 'password123' };

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should return 400 if password is too short', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: '123' };

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password must be at least 6 characters long' });
    });

    it('should return 400 if role is invalid', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123', role: 'invalid' };

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Role must be either "user" or "admin"' });
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
      const mockUpdatedUser = { id: 1, name: 'Updated User', email: 'updated@test.com', role: 'user', balance: 100, is_active: true, updated_at: '2024-01-01' };
      
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated User', email: 'updated@test.com' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing user
        .mockResolvedValueOnce({ rows: [] }) // Check email doesn't exist for other users
        .mockResolvedValueOnce({ rows: [mockUpdatedUser] }); // Update user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: mockUpdatedUser
      });
    });

    it('should update user role when specified', async () => {
      const mockUpdatedUser = { id: 1, name: 'Test User', email: 'test@test.com', role: 'admin', balance: 100, is_active: true, updated_at: '2024-01-01' };
      
      mockReq.params = { id: '1' };
      mockReq.body = { role: 'admin' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing user
        .mockResolvedValueOnce({ rows: [mockUpdatedUser] }); // Update user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: mockUpdatedUser
      });
    });

    it('should return 400 if role is invalid', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { role: 'invalid' };
      
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Check existing user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Role must be either "user" or "admin"' });
    });

    it('should return 400 if email format is invalid', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { email: 'invalid-email' };
      
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Check existing user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should return 400 if email already exists for another user', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { email: 'existing@test.com' };
      
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check existing user
        .mockResolvedValueOnce({ rows: [{ id: 2 }] }); // Email exists for another user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should return 400 if no fields to update', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = {};
      
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Check existing user

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No fields to update' });
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
