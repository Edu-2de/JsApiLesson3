import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUser, validateId } from '../middleware/validation';

const router = Router();

// GET /users - Listar todos os usuários
router.get('/', UserController.getAllUsers);

// GET /users/:id - Buscar usuário por ID
router.get('/:id', validateId, UserController.getUserById);

// POST /users - Criar novo usuário
router.post('/', validateUser, UserController.createUser);

// PUT /users/:id - Atualizar usuário
router.put('/:id', validateId, UserController.updateUser);

// DELETE /users/:id - Deletar usuário
router.delete('/:id', validateId, UserController.deleteUser);

export default router;