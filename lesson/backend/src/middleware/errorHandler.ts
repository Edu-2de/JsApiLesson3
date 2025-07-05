import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  // Erro de validação do PostgreSQL
  if (err.code === '23505') {
    res.status(400).json({
      message: 'Duplicate entry',
      error: 'This record already exists'
    });
    return;
  }

  // Erro de referência não encontrada
  if (err.code === '23503') {
    res.status(400).json({
      message: 'Foreign key constraint violation',
      error: 'Referenced record not found'
    });
    return;
  }

  // Erro de sintaxe SQL
  if (err.code === '42601') {
    res.status(500).json({
      message: 'Database query error',
      error: 'Invalid SQL syntax'
    });
    return;
  }

  // Erro genérico
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};