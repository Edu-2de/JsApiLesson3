import api from '../lib/api';
import type { Transaction, CreateTransactionData, PaginatedResponse } from '../types';

class TransactionService {
  async getTransactions(page = 1, limit = 10): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<Transaction>>(`/transactions?${params}`);
    return response.data;
  }

  async getUserTransactions(userId: number, page = 1, limit = 10): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<Transaction>>(`/transactions/user/${userId}?${params}`);
    return response.data;
  }

  async getTransaction(id: number): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  }

  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  }

  async getTransactionsByType(type: string, page = 1, limit = 10): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get<PaginatedResponse<Transaction>>(`/transactions/type?${params}`);
    return response.data;
  }

  async getTransactionStats(): Promise<{
    total_transactions: number;
    total_amount: number;
    purchases: number;
    refunds: number;
    deposits: number;
  }> {
    const response = await api.get('/transactions/stats');
    return response.data;
  }
}

export const transactionService = new TransactionService();
