import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

// GET /products - Listar todos os produtos
router.get('/', ProductController.getAllProducts);

// GET /products/search - Buscar produtos com filtros
router.get('/search', ProductController.searchProducts);

// GET /products/:id - Buscar produto por ID
router.get('/:id', ProductController.getProductById);

// POST /products - Criar novo produto
router.post('/', ProductController.createProduct);

// PUT /products/:id - Atualizar produto
router.put('/:id', ProductController.updateProduct);

// DELETE /products/:id - Deletar produto
router.delete('/:id', ProductController.deleteProduct);

export default router;