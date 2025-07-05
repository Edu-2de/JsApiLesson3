import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      message: 'Access denied. No token provided.' 
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      message: 'Invalid token.' 
    });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      message: 'Access denied. No user information.' 
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ 
      message: 'Access denied. Admin role required.' 
    });
    return;
  }

  next();
};

export const requireOwnerOrAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      message: 'Access denied. No user information.' 
    });
    return;
  }

  const userId = parseInt(req.params.id || req.params.user_id);
  
  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. You can only access your own data.' 
    });
  }
};