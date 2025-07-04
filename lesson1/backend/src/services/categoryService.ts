import { Database } from '../database/database';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest
} from '../types';

export class CategoryService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async getAllCategories(): Promise<Category[]> {
    const query = `
      SELECT id, name, description, created_at, updated_at
      FROM categories
      ORDER BY name ASC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  async getCategoryById(id: number): Promise<Category | null> {
    const query = `
      SELECT id, name, description, created_at, updated_at
      FROM categories
      WHERE id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const values = [
      categoryData.name,
      categoryData.description || null
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (categoryData.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(categoryData.name);
      paramIndex++;
    }

    if (categoryData.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(categoryData.description);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo fornecido para atualização');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE categories 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Verificar se há produtos associados
    const checkQuery = 'SELECT COUNT(*) as count FROM products WHERE category_id = $1';
    const checkResult = await this.db.query(checkQuery, [id]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      throw new Error('Não é possível deletar categoria com produtos associados');
    }

    const query = 'DELETE FROM categories WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  async getCategoryWithProductCount(): Promise<any[]> {
    const query = `
      SELECT 
        c.id, c.name, c.description, c.created_at, c.updated_at,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
      ORDER BY c.name ASC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }
}
