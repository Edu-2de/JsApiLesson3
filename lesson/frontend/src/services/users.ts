import { api } from '@/lib/api';
import { User, ApiResponse } from '@/types';

export const userService = {
  async getAll(): Promise<{ users: User[] }> {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: number): Promise<{ user: User }> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(user: { name: string; email: string; password: string }): Promise<ApiResponse<User>> {
    const response = await api.post('/users', user);
    return response.data;
  },

  async update(id: number, user: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};