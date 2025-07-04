import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

// GET /api/products - Listar todos os produtos com filtros e paginação
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Buscar produto por ID
router.get('/:id', productController.getProductById);

// POST /api/products - Criar novo produto
router.post('/', productController.createProduct);

// PUT /api/products/:id - Atualizar produto
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Deletar produto
router.delete('/:id', productController.deleteProduct);

// PATCH /api/products/:id/stock - Atualizar estoque
router.patch('/:id/stock', productController.updateStock);

export default router;
