const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { validateProduct, validateId, validatePagination } = require('../middleware/validation');

// GET /api/products - Listar todos os produtos
router.get('/', validatePagination, getAllProducts);

// GET /api/products/:id - Buscar produto por ID
router.get('/:id', validateId, getProductById);

// POST /api/products - Criar novo produto
router.post('/', validateProduct, createProduct);

// PUT /api/products/:id - Atualizar produto
router.put('/:id', validateId, validateProduct, updateProduct);

// DELETE /api/products/:id - Deletar produto
router.delete('/:id', validateId, deleteProduct);

module.exports = router;
