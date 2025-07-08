import { Pool } from 'pg';

// Mock do pool de conexão
jest.mock('../database/connection', () => ({
  query: jest.fn(),
  connect: jest.fn(() => ({
    query: jest.fn(),
    release: jest.fn(),
  })),
}));

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock do JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
  verify: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com', role: 'user' }),
}));

// Configuração global para testes
beforeEach(() => {
  jest.clearAllMocks();
});
