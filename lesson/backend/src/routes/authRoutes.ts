import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /auth/login - Login
router.post('/login', AuthController.login);

// POST /auth/register - Register
router.post('/register', AuthController.register);

// GET /auth/profile - Get profile (requires authentication)
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;