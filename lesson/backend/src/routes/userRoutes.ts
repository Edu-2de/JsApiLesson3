import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// GET /users - Listar todos os usuários
router.get('/', UserController.getAllUsers);

// GET /users/:id - Buscar usuário por ID
router.get('/:id', UserController.getUserById);

// POST /users - Criar novo usuário
router.post('/', UserController.createUser);

// PUT /users/:id - Atualizar usuário
router.put('/:id', UserController.updateUser);

// DELETE /users/:id - Deletar usuário
router.delete('/:id', UserController.deleteUser);

export default router;