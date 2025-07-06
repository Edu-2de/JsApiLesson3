import api from '../lib/api';
import type { Order, CreateOrderData, PaginatedResponse } from '../types';

class OrderService {
  async getOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<Order>>(`/orders?${params}`);
    return response.data;
  }

  async getUserOrders(userId: number, page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<Order>>(`/orders/user/${userId}?${params}`);
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  }

  async updateOrderStatus(id: number, status: 'pending' | 'completed' | 'cancelled'): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }

  async cancelOrder(id: number): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/cancel`);
    return response.data;
  }

  async getOrderStats(): Promise<{
    total_orders: number;
    total_amount: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
  }> {
    const response = await api.get('/orders/stats');
    return response.data;
  }
}

export const orderService = new OrderService();
