export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  order_id?: number;
  created_at: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface PurchaseRequest {
  items: {
    product_id: number;
    quantity: number;
  }[];
}