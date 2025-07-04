import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const includeProductCount = req.query.include_product_count === 'true';
    
    let categories;
    if (includeProductCount) {
      categories = await this.categoryService.getCategoryWithProductCount();
    } else {
      categories = await this.categoryService.getAllCategories();
    }

    res.json({
      success: true,
      data: categories
    });
  });

  public getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID da categoria inválido', 400);
    }

    const category = await this.categoryService.getCategoryById(id);
    
    if (!category) {
      throw createError('Categoria não encontrada', 404);
    }

    res.json({
      success: true,
      data: category
    });
  });

  public createCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryData: CreateCategoryRequest = req.body;

    // Validações básicas
    if (!categoryData.name) {
      throw createError('Nome da categoria é obrigatório', 400);
    }

    if (categoryData.name.length > 100) {
      throw createError('Nome da categoria não pode exceder 100 caracteres', 400);
    }

    try {
      const category = await this.categoryService.createCategory(categoryData);

      res.status(201).json({
        success: true,
        data: category,
        message: 'Categoria criada com sucesso'
      });
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        throw createError('Categoria com esse nome já existe', 400);
      }
      throw error;
    }
  });

  public updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoryData: UpdateCategoryRequest = req.body;

    if (isNaN(id)) {
      throw createError('ID da categoria inválido', 400);
    }

    // Validações
    if (categoryData.name && categoryData.name.length > 100) {
      throw createError('Nome da categoria não pode exceder 100 caracteres', 400);
    }

    try {
      const category = await this.categoryService.updateCategory(id, categoryData);

      if (!category) {
        throw createError('Categoria não encontrada', 404);
      }

      res.json({
        success: true,
        data: category,
        message: 'Categoria atualizada com sucesso'
      });
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation
        throw createError('Categoria com esse nome já existe', 400);
      }
      throw error;
    }
  });

  public deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw createError('ID da categoria inválido', 400);
    }

    try {
      const deleted = await this.categoryService.deleteCategory(id);

      if (!deleted) {
        throw createError('Categoria não encontrada', 404);
      }

      res.json({
        success: true,
        message: 'Categoria deletada com sucesso'
      });
    } catch (error: any) {
      if (error.message.includes('produtos associados')) {
        throw createError('Não é possível deletar categoria com produtos associados', 400);
      }
      throw error;
    }
  });
}
