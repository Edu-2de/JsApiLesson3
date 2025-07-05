import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { validateProduct, validateId } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /products - Listar todos os produtos (público)
router.get('/', ProductController.getAllProducts);

// GET /products/search - Buscar produtos com filtros (público)
router.get('/search', ProductController.searchProducts);

// GET /products/:id - Buscar produto por ID (público)
router.get('/:id', validateId, ProductController.getProductById);

// POST /products - Criar novo produto (apenas admin)
router.post('/', authenticateToken, requireAdmin, validateProduct, ProductController.createProduct);

// PUT /products/:id - Atualizar produto (apenas admin)
router.put('/:id', authenticateToken, requireAdmin, validateId, ProductController.updateProduct);

// DELETE /products/:id - Deletar produto (apenas admin)
router.delete('/:id', authenticateToken, requireAdmin, validateId, ProductController.deleteProduct);

export default router;