import React, { useState, useEffect } from 'react';
import { productService, categoryService, systemService } from '../services/api';
import Loading from '../components/Loading';

const Home = ({ currentUser }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    fetchStats();
    checkSystemStatus();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Buscar produtos recentes
      const productsResponse = await productService.getAll({ limit: 6 });
      const categoriesResponse = await categoryService.getAll();
      
      setStats({
        totalProducts: productsResponse.data.data.length,
        totalCategories: categoriesResponse.data.data.length,
        recentProducts: productsResponse.data.data
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const healthResponse = await systemService.health();
      const dbResponse = await systemService.testDb();
      setSystemStatus({
        api: healthResponse.data.status === 'OK',
        database: dbResponse.data.status === 'success'
      });
    } catch (error) {
      setSystemStatus({
        api: false,
        database: false
      });
    }
  };

  return (
    <div className="container mt-4">
      {/* Hero Section */}
      <div className="jumbotron bg-primary text-white p-5 rounded mb-4">
        <div className="container">
          <h1 className="display-4">
            <i className="bi bi-shop"></i> Rede de Produtos
          </h1>
          <p className="lead">
            Marketplace para compra e venda de produtos
          </p>
          {currentUser ? (
            <p>
              Bem-vindo, <strong>{currentUser.name}</strong>! 
              {currentUser.role === 'admin' && (
                <span className="badge bg-warning ms-2">Administrador</span>
              )}
            </p>
          ) : (
            <p>Selecione um usuário no menu para começar a navegar.</p>
          )}
        </div>
      </div>

      {/* Status do Sistema */}
      {systemStatus && (
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-gear"></i> Status do Sistema
                </h5>
                <div className="d-flex justify-content-between">
                  <span>API:</span>
                  <span className={`badge ${systemStatus.api ? 'bg-success' : 'bg-danger'}`}>
                    {systemStatus.api ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span>Banco de Dados:</span>
                  <span className={`badge ${systemStatus.database ? 'bg-success' : 'bg-danger'}`}>
                    {systemStatus.database ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-graph-up"></i> Estatísticas
                </h5>
                <div className="d-flex justify-content-between">
                  <span>Total de Produtos:</span>
                  <span className="badge bg-primary">{stats.totalProducts}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span>Total de Categorias:</span>
                  <span className="badge bg-secondary">{stats.totalCategories}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Produtos Recentes */}
      <div className="row">
        <div className="col-12">
          <h3 className="mb-4">
            <i className="bi bi-clock-history"></i> Produtos Recentes
          </h3>
          
          {loading ? (
            <Loading message="Carregando produtos..." />
          ) : (
            <div className="row">
              {stats.recentProducts.map(product => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        className="card-img-top" 
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h5 text-success mb-0">
                            R$ {parseFloat(product.price).toFixed(2)}
                          </span>
                          <span className="badge bg-secondary">
                            Estoque: {product.stock_quantity}
                          </span>
                        </div>
                        <small className="text-muted d-block mt-2">
                          Categoria: {product.category_name || 'Sem categoria'}
                        </small>
                        <small className="text-muted d-block">
                          Vendedor: {product.seller_name}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stats.recentProducts.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="bi bi-box display-1 text-muted"></i>
              <p className="mt-3 text-muted">Nenhum produto cadastrado ainda</p>
              {currentUser && (
                <p className="text-muted">Comece criando seu primeiro produto!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">
            <i className="bi bi-lightning"></i> Links Rápidos
          </h3>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-tags display-4 text-primary"></i>
              <h5 className="card-title mt-3">Categorias</h5>
              <p className="card-text">Gerenciar categorias de produtos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-box display-4 text-success"></i>
              <h5 className="card-title mt-3">Produtos</h5>
              <p className="card-text">Ver e gerenciar produtos</p>
            </div>
          </div>
        </div>
        {currentUser?.role === 'admin' && (
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-people display-4 text-warning"></i>
                <h5 className="card-title mt-3">Usuários</h5>
                <p className="card-text">Gerenciar usuários do sistema</p>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-person-circle display-4 text-info"></i>
              <h5 className="card-title mt-3">Perfil</h5>
              <p className="card-text">Ver e editar seu perfil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
