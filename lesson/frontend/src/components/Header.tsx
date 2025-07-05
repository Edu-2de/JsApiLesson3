'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Home, Package, Users, CreditCard } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TechStore</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Home className="h-4 w-4" />
              <span>Início</span>
            </Link>
            <Link href="/products" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Package className="h-4 w-4" />
              <span>Produtos</span>
            </Link>
            {isAuthenticated && (
              <Link href="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <ShoppingCart className="h-4 w-4" />
                <span>Carrinho</span>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                <Users className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{user?.name}</span>
                </Link>
                <Link href="/orders" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:block">Pedidos</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                  Entrar
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}