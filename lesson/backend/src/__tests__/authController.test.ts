import { Request, Response } from 'express';
import { AuthController } from '../controllers/authController';
import pool from '../database/connection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock das dependências
jest.mock('../database/connection');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPool = pool as any;
const mockBcrypt = bcrypt as any;
const mockJwt = jwt as any;

describe('AuthController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined
    };
    
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      mockReq.body = { email: 'test@test.com' };

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });

    it('should return 401 if user not found', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should return 401 if account is inactive', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      mockPool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          password_hash: 'hashedPassword',
          role: 'user',
          balance: 100,
          is_active: false
        }]
      });

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Account is inactive' });
    });

    it('should return 401 if password is invalid', async () => {
      mockReq.body = { email: 'test@test.com', password: 'wrongPassword' };
      mockPool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          password_hash: 'hashedPassword',
          role: 'user',
          balance: 100,
          is_active: true
        }]
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    it('should return success response with token on valid login', async () => {
      mockReq.body = { email: 'test@test.com', password: 'password123' };
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        password_hash: 'hashedPassword',
        role: 'user',
        balance: 100,
        is_active: true
      };
      
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockJwt.sign.mockReturnValueOnce('mockedToken');

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockedToken',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@test.com',
          role: 'user',
          balance: 100
        }
      });
    });
  });

  describe('register', () => {
    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Name, email and password are required' });
    });

    it('should return 400 if email format is invalid', async () => {
      mockReq.body = { name: 'Test User', email: 'invalid-email', password: 'password123' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should return 400 if password is too short', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: '123' };

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password must be at least 6 characters long' });
    });

    it('should return 400 if email already exists', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123' };
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    it('should create user successfully', async () => {
      mockReq.body = { name: 'Test User', email: 'test@test.com', password: 'password123' };
      const mockNewUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: 'user',
        balance: 0
      };

      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockNewUser] });
      
      mockBcrypt.hash.mockResolvedValueOnce('hashedPassword');
      mockJwt.sign.mockReturnValueOnce('mockedToken');

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token: 'mockedToken',
        user: mockNewUser
      });
    });
  });

  describe('getProfile', () => {
    it('should return 404 if user not found', async () => {
      mockReq.user = { id: 1 };
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: 'user',
        balance: 100,
        created_at: '2024-01-01'
      };

      mockReq.user = { id: 1 };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      await AuthController.getProfile(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Profile retrieved successfully',
        user: mockUser
      });
    });
  });
});
