const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    getProfile
} = require('../controllers/userController');

const { validateUser, validateId, validateRole, validatePagination } = require('../middleware/validation');
const { authenticateUser, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');

// Rotas públicas (não precisam de autenticação)
// POST /api/users - Criar novo usuário (registro)
router.post('/', validateUser, createUser);

// Rotas que precisam de autenticação
// GET /api/users/profile - Buscar próprio perfil
router.get('/profile', authenticateUser, getProfile);

// Rotas que precisam de autenticação e o usuário ser o próprio ou admin
// GET /api/users/:id - Buscar usuário por ID
router.get('/:id', authenticateUser, validateId, requireOwnerOrAdmin, getUserById);

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', authenticateUser, validateId, validateUser, requireOwnerOrAdmin, updateUser);

// Rotas que precisam de permissão de admin
// GET /api/users - Listar todos os usuários (apenas admin)
router.get('/', authenticateUser, requireAdmin, validatePagination, getAllUsers);

// PUT /api/users/:id/role - Atualizar role do usuário (apenas admin)
router.put('/:id/role', authenticateUser, requireAdmin, validateId, validateRole, updateUserRole);

// DELETE /api/users/:id - Deletar usuário (apenas admin)
router.delete('/:id', authenticateUser, requireAdmin, validateId, deleteUser);

module.exports = router;
