import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

const Header = ({ currentUser, setCurrentUser, currentPage, setCurrentPage }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (userId) => {
    const user = users.find(u => u.id === parseInt(userId));
    setCurrentUser(user);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', user?.role || 'user');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={() => setCurrentPage('home')}>
          <i className="bi bi-shop"></i> Rede de Produtos
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                href="#"
                onClick={() => setCurrentPage('home')}
              >
                <i className="bi bi-house"></i> Início
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`}
                href="#"
                onClick={() => setCurrentPage('categories')}
              >
                <i className="bi bi-tags"></i> Categorias
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
                href="#"
                onClick={() => setCurrentPage('products')}
              >
                <i className="bi bi-box"></i> Produtos
              </a>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <a 
                  className={`nav-link ${currentPage === 'users' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentPage('users')}
                >
                  <i className="bi bi-people"></i> Usuários
                </a>
              </li>
            )}
          </ul>
          
          <div className="navbar-nav">
            {!currentUser ? (
              <div className="nav-item">
                <select 
                  className="form-select"
                  onChange={(e) => handleUserChange(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecionar usuário</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i> {currentUser.name}
                  {isAdmin && <span className="badge bg-warning ms-1">Admin</span>}
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#" onClick={() => setCurrentPage('profile')}>
                    <i className="bi bi-person"></i> Perfil
                  </a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Sair
                  </a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
