import api from '../lib/api';
import type { Product, CreateProductData, PaginatedResponse } from '../types';

class ProductService {
  async getProducts(page = 1, limit = 10, category?: number): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category_id', category.toString());
    }
    
    const response = await api.get<PaginatedResponse<Product>>(`/products?${params}`);
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  }

  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  async searchProducts(query: string, page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<Product>>(`/products/search?${params}`);
    return response.data;
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/featured?limit=${limit}`);
    return response.data;
  }
}

export const productService = new ProductService();
