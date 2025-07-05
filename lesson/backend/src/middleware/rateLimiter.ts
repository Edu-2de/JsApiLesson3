import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Limpar entradas expiradas
    if (store[ip] && now > store[ip].resetTime) {
      delete store[ip];
    }

    // Inicializar ou incrementar contador
    if (!store[ip]) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
      store[ip].count++;
    }

    // Verificar se excedeu o limite
    if (store[ip].count > maxRequests) {
      res.status(429).json({
        message: 'Too many requests',
        error: `Rate limit exceeded. Try again in ${Math.ceil((store[ip].resetTime - now) / 1000)} seconds`
      });
      return;
    }

    // Adicionar headers informativos
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - store[ip].count).toString(),
      'X-RateLimit-Reset': new Date(store[ip].resetTime).toISOString()
    });

    next();
  };
};