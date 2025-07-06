import api from '../lib/api';
import type { User, PaginatedResponse } from '../types';

class UserService {
  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<User>>(`/users?${params}`);
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async addBalance(userId: number, amount: number): Promise<User> {
    const response = await api.post<User>(`/users/${userId}/balance`, { amount });
    return response.data;
  }

  async getUserBalance(userId: number): Promise<{ balance: number }> {
    const response = await api.get<{ balance: number }>(`/users/${userId}/balance`);
    return response.data;
  }

  async searchUsers(query: string, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<User>>(`/users/search?${params}`);
    return response.data;
  }
}

export const userService = new UserService();
