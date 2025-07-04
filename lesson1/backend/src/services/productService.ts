import { Database } from '../database/database';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductWithCategory, 
  QueryParams,
  PaginatedResponse
} from '../types';

export class ProductService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async getAllProducts(params: QueryParams): Promise<PaginatedResponse<ProductWithCategory>> {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      min_price,
      max_price,
      is_active,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = params;

    const offset = (page - 1) * limit;
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    // Filtros
    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (category_id) {
      whereConditions.push(`p.category_id = $${paramIndex}`);
      queryParams.push(category_id);
      paramIndex++;
    }

    if (min_price) {
      whereConditions.push(`p.price >= $${paramIndex}`);
      queryParams.push(min_price);
      paramIndex++;
    }

    if (max_price) {
      whereConditions.push(`p.price <= $${paramIndex}`);
      queryParams.push(max_price);
      paramIndex++;
    }

    if (is_active !== undefined) {
      whereConditions.push(`p.is_active = $${paramIndex}`);
      queryParams.push(is_active);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Query para contar total de itens
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    const countResult = await this.db.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].total);

    // Query principal
    const query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock_quantity, 
        p.category_id, p.image_url, p.is_active, p.created_at, p.updated_at,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${sort_by} ${sort_order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    
    const result = await this.db.query(query, queryParams);
    
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      success: true,
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  }

  async getProductById(id: number): Promise<ProductWithCategory | null> {
    const query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock_quantity, 
        p.category_id, p.image_url, p.is_active, p.created_at, p.updated_at,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const query = `
      INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      productData.name,
      productData.description || null,
      productData.price,
      productData.stock_quantity,
      productData.category_id || null,
      productData.image_url || null
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (productData.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(productData.name);
      paramIndex++;
    }

    if (productData.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(productData.description);
      paramIndex++;
    }

    if (productData.price !== undefined) {
      fields.push(`price = $${paramIndex}`);
      values.push(productData.price);
      paramIndex++;
    }

    if (productData.stock_quantity !== undefined) {
      fields.push(`stock_quantity = $${paramIndex}`);
      values.push(productData.stock_quantity);
      paramIndex++;
    }

    if (productData.category_id !== undefined) {
      fields.push(`category_id = $${paramIndex}`);
      values.push(productData.category_id);
      paramIndex++;
    }

    if (productData.image_url !== undefined) {
      fields.push(`image_url = $${paramIndex}`);
      values.push(productData.image_url);
      paramIndex++;
    }

    if (productData.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex}`);
      values.push(productData.is_active);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo fornecido para atualização');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  async updateStock(id: number, quantity: number): Promise<Product | null> {
    const query = `
      UPDATE products 
      SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await this.db.query(query, [quantity, id]);
    return result.rows[0] || null;
  }
}
