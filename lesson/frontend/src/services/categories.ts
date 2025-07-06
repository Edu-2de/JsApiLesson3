import { api } from '@/lib/api';
import { Category, Product, ApiResponse } from '@/types';

export const categoryService = {
  async getAll(): Promise<{ categories: Category[] }> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getById(id: number): Promise<{ category: Category }> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async getProducts(id: number): Promise<{ products: Product[] }> {
    const response = await api.get(`/categories/${id}/products`);
    return response.data;
  },

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Category>> {
    const response = await api.post('/categories', category);
    return response.data;
  },

  async update(id: number, category: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};