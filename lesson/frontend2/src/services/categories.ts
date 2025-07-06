import api from '../lib/api';
import type { Category, CreateCategoryData } from '../types';

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  }

  async updateCategory(id: number, data: Partial<CreateCategoryData>): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
