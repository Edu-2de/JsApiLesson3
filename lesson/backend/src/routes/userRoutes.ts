import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateId } from '../middleware/validation';
import { authenticateToken, requireAdmin, requireOwnerOrAdmin } from '../middleware/auth';

const router = Router();

// GET /users - Listar todos os usuários (apenas admin)
router.get('/', authenticateToken, requireAdmin, UserController.getAllUsers);

// GET /users/:id - Buscar usuário por ID (próprio usuário ou admin)
router.get('/:id', authenticateToken, validateId, requireOwnerOrAdmin, UserController.getUserById);

// POST /users - Criar novo usuário (apenas admin)
router.post('/', authenticateToken, requireAdmin, UserController.createUser);

// PUT /users/:id - Atualizar usuário (próprio usuário ou admin)
router.put('/:id', authenticateToken, validateId, requireOwnerOrAdmin, UserController.updateUser);

// DELETE /users/:id - Deletar usuário (apenas admin)
router.delete('/:id', authenticateToken, validateId, requireAdmin, UserController.deleteUser);

export default router;