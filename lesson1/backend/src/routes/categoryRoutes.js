const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const { validateCategory, validateId } = require('../middleware/validation');

// GET /api/categories - Listar todas as categorias
router.get('/', getAllCategories);

// GET /api/categories/:id - Buscar categoria por ID
router.get('/:id', validateId, getCategoryById);

// POST /api/categories - Criar nova categoria
router.post('/', validateCategory, createCategory);

// PUT /api/categories/:id - Atualizar categoria
router.put('/:id', validateId, validateCategory, updateCategory);

// DELETE /api/categories/:id - Deletar categoria
router.delete('/:id', validateId, deleteCategory);

module.exports = router;
