import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { validateId } from '../middleware/validation';

const router = Router();

// GET /categories - Listar todas as categorias
router.get('/', CategoryController.getAllCategories);

// GET /categories/:id - Buscar categoria por ID
router.get('/:id', validateId, CategoryController.getCategoryById);

// GET /categories/:id/products - Buscar produtos por categoria
router.get('/:id/products', validateId, CategoryController.getProductsByCategory);

// POST /categories - Criar nova categoria
router.post('/', CategoryController.createCategory);

// PUT /categories/:id - Atualizar categoria
router.put('/:id', validateId, CategoryController.updateCategory);

// DELETE /categories/:id - Deletar categoria
router.delete('/:id', validateId, CategoryController.deleteCategory);

export default router;