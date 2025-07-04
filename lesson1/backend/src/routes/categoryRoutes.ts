import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = Router();
const categoryController = new CategoryController();

// GET /api/categories - Listar todas as categorias
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Buscar categoria por ID
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - Criar nova categoria
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - Atualizar categoria
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - Deletar categoria
router.delete('/:id', categoryController.deleteCategory);

export default router;
