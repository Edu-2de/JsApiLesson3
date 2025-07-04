import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import UserList from './components/UserList';
import { userService } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchCurrentUser(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (userId) => {
    try {
      const response = await userService.getById(userId);
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home currentUser={currentUser} />;
      case 'categories':
        return <CategoryList currentUser={currentUser} />;
      case 'products':
        return <ProductList currentUser={currentUser} />;
      case 'users':
        return <UserList currentUser={currentUser} />;
      case 'profile':
        if (!currentUser) {
          return (
            <div className="container mt-4">
              <div className="alert alert-warning">
                Você precisa estar logado para ver o perfil.
              </div>
            </div>
          );
        }
        return (
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h3><i className="bi bi-person-circle"></i> Meu Perfil</h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Nome:</strong> {currentUser.name}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>Telefone:</strong> {currentUser.phone || 'Não informado'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Cidade:</strong> {currentUser.city || 'Não informado'}</p>
                        <p><strong>Estado:</strong> {currentUser.state || 'Não informado'}</p>
                        <p><strong>Role:</strong> 
                          <span className={`badge ms-2 ${currentUser.role === 'admin' ? 'bg-warning' : 'bg-secondary'}`}>
                            {currentUser.role}
                          </span>
                        </p>
                      </div>
                    </div>
                    {currentUser.address && (
                      <div className="row">
                        <div className="col-12">
                          <p><strong>Endereço:</strong> {currentUser.address}</p>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-12">
                        <small className="text-muted">
                          Membro desde: {new Date(currentUser.created_at).toLocaleDateString('pt-BR')}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Home currentUser={currentUser} />;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <main className="main-content">
        {renderCurrentPage()}
      </main>

      <footer className="bg-light mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Rede de Produtos</h5>
              <p className="text-muted">
                Sistema de marketplace para compra e venda de produtos.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted">
                Desenvolvido com React + Node.js + PostgreSQL
              </p>
              <p className="text-muted">
                © 2025 Rede de Produtos
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
