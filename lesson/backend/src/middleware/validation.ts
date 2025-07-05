import { Request, Response, NextFunction } from 'express';

// Middleware para validar criação de usuário
export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  // Validar se todos os campos obrigatórios estão presentes
  if (!name || !email || !password) {
    res.status(400).json({
      message: 'Validation error',
      errors: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      }
    });
    return;
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      message: 'Invalid email format'
    });
    return;
  }

  // Validar senha (mínimo 6 caracteres)
  if (password.length < 6) {
    res.status(400).json({
      message: 'Password must be at least 6 characters long'
    });
    return;
  }

  next();
};

// Middleware para validar criação de produto
export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { name, price, stock_quantity } = req.body;

  // Validar se campos obrigatórios estão presentes
  if (!name || !price) {
    res.status(400).json({
      message: 'Validation error',
      errors: {
        name: !name ? 'Name is required' : null,
        price: !price ? 'Price is required' : null
      }
    });
    return;
  }

  // Validar se o preço é um número válido
  if (isNaN(price) || price <= 0) {
    res.status(400).json({
      message: 'Price must be a valid positive number'
    });
    return;
  }

  // Validar stock_quantity se fornecido
  if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
    res.status(400).json({
      message: 'Stock quantity must be a non-negative number'
    });
    return;
  }

  next();
};

// Middleware para validar ID nos parâmetros
export const validateId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400).json({
      message: 'Invalid ID parameter'
    });
    return;
  }

  next();
};