// User types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string;
  stock: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string;
  stock: number;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

// Transaction types
export interface Transaction {
  id: number;
  user_id: number;
  type: 'purchase' | 'refund' | 'deposit';
  amount: number;
  description: string;
  created_at: string;
  user_name?: string;
}

export interface CreateTransactionData {
  user_id: number;
  type: 'purchase' | 'refund' | 'deposit';
  amount: number;
  description: string;
}

// Order types
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
  product_image?: string;
}

export interface CreateOrderData {
  items: {
    product_id: number;
    quantity: number;
  }[];
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  [key: string]: boolean;
}
