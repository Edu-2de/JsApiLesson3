import { api } from '@/lib/api';
import { Transaction, Order, PurchaseRequest, ApiResponse } from '@/types';

export const transactionService = {
  async addBalance(user_id: number, amount: number, description: string): Promise<ApiResponse<void>> {
    const response = await api.post('/transactions/add-balance', {
      user_id,
      amount,
      description
    });
    return response.data;
  },

  async getBalance(user_id: number): Promise<{ balance: number }> {
    const response = await api.get(`/transactions/balance/${user_id}`);
    return response.data;
  },

  async getTransactions(user_id: number): Promise<{ transactions: Transaction[] }> {
    const response = await api.get(`/transactions/transactions/${user_id}`);
    return response.data;
  },

  async makePurchase(purchase: PurchaseRequest): Promise<ApiResponse<{ order: Order; new_balance: number }>> {
    const response = await api.post('/transactions/purchase', purchase);
    return response.data;
  },

  async getOrders(user_id: number): Promise<{ orders: Order[] }> {
    const response = await api.get(`/transactions/orders/${user_id}`);
    return response.data;
  }
};