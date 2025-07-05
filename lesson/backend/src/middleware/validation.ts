import { Request, Response, NextFunction } from 'express';

// Middleware para validar criação de usuário
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validar se todos os campos obrigatórios estão presentes
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Validation error',
      errors: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      }
    });
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format'
    });
  }

  // Validar senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long'
    });
  }

  next();
};

// Middleware para validar criação de produto
export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, stock_quantity } = req.body;

  // Validar se campos obrigatórios estão presentes
  if (!name || !price) {
    return res.status(400).json({
      message: 'Validation error',
      errors: {
        name: !name ? 'Name is required' : null,
        price: !price ? 'Price is required' : null
      }
    });
  }

  // Validar se o preço é um número válido
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: 'Price must be a valid positive number'
    });
  }

  // Validar stock_quantity se fornecido
  if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
    return res.status(400).json({
      message: 'Stock quantity must be a non-negative number'
    });
  }

  next();
};

// Middleware para validar ID nos parâmetros
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      message: 'Invalid ID parameter'
    });
  }

  next();
};