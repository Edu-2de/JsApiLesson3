import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { CreateProductRequest, UpdateProductRequest, QueryParams } from '../types';
import { asyncHandler, createError } from '../middleware/errorHandler';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const queryParams: QueryParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      search: req.query.search as string,
      category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
      min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
      max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
      is_active: req.query.is_active ? req.query.is_active === 'true' : undefined,
      sort_by: req.query.sort_by as 'name' | 'price' | 'created_at',
      sort_order: req.query.sort_order as 'ASC' | 'DESC'
    };

    const result = await this.productService.getAllProducts(queryParams);
    res.json(result);
  });

  public getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID do produto inválido', 400);
    }

    const product = await this.productService.getProductById(id);
    
    if (!product) {
      throw createError('Produto não encontrado', 404);
    }

    res.json({
      success: true,
      data: product
    });
  });

  public createProduct = asyncHandler(async (req: Request, res: Response) => {
    const productData: CreateProductRequest = req.body;

    // Validações básicas
    if (!productData.name || !productData.price || productData.stock_quantity === undefined) {
      throw createError('Nome, preço e quantidade em estoque são obrigatórios', 400);
    }

    if (productData.price < 0) {
      throw createError('Preço não pode ser negativo', 400);
    }

    if (productData.stock_quantity < 0) {
      throw createError('Quantidade em estoque não pode ser negativa', 400);
    }

    const product = await this.productService.createProduct(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Produto criado com sucesso'
    });
  });

  public updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const productData: UpdateProductRequest = req.body;

    if (isNaN(id)) {
      throw createError('ID do produto inválido', 400);
    }

    // Validações
    if (productData.price !== undefined && productData.price < 0) {
      throw createError('Preço não pode ser negativo', 400);
    }

    if (productData.stock_quantity !== undefined && productData.stock_quantity < 0) {
      throw createError('Quantidade em estoque não pode ser negativa', 400);
    }

    const product = await this.productService.updateProduct(id, productData);

    if (!product) {
      throw createError('Produto não encontrado', 404);
    }

    res.json({
      success: true,
      data: product,
      message: 'Produto atualizado com sucesso'
    });
  });

  public deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw createError('ID do produto inválido', 400);
    }

    const deleted = await this.productService.deleteProduct(id);

    if (!deleted) {
      throw createError('Produto não encontrado', 404);
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  });

  public updateStock = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    if (isNaN(id)) {
      throw createError('ID do produto inválido', 400);
    }

    if (quantity === undefined || typeof quantity !== 'number') {
      throw createError('Quantidade é obrigatória e deve ser um número', 400);
    }

    const product = await this.productService.updateStock(id, quantity);

    if (!product) {
      throw createError('Produto não encontrado', 404);
    }

    res.json({
      success: true,
      data: product,
      message: 'Estoque atualizado com sucesso'
    });
  });
}
