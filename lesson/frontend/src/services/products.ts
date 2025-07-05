import { api } from '@/lib/api';
import { Product, ApiResponse } from '@/types';

export const productService = {
  async getAll(): Promise<{ products: Product[] }> {
    const response = await api.get('/products');
    return response.data;
  },

  async getById(id: number): Promise<{ product: Product }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async search(params: {
    name?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
  }): Promise<{ products: Product[] }> {
    const response = await api.get('/products/search', { params });
    return response.data;
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', product);
    return response.data;
  },

  async update(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};