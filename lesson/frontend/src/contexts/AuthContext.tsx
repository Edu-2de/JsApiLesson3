import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '@/services/auth';

// 1. DEFININDO O TIPO DO CONTEXTO
// Esta interface define quais dados e funções estarão disponíveis 
// para todos os componentes que usarem este contexto
interface AuthContextType {
  user: User | null;              // Usuário logado (null se não estiver logado)
  isAuthenticated: boolean;       // true se estiver logado, false se não
  isAdmin: boolean;              // true se o usuário for admin
  login: (email: string, password: string) => Promise<void>;  // Função para fazer login
  register: (name: string, email: string, password: string) => Promise<void>; // Função para registrar
  logout: () => void;            // Função para fazer logout
  loading: boolean;              // true enquanto está carregando dados do usuário
}

// 2. CRIANDO O CONTEXTO
// createContext cria um "espaço compartilhado" onde os dados ficarão armazenados
// O valor inicial é undefined, mas depois será preenchido pelo AuthProvider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. DEFININDO AS PROPS DO PROVIDER
// ReactNode significa que pode receber qualquer elemento React como children
interface AuthProviderProps {
  children: ReactNode;
}

// 4. CRIANDO O PROVIDER (PROVEDOR)
// Este componente vai "envolver" toda a aplicação e fornecer os dados de autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  
  // 5. ESTADOS LOCAIS DO CONTEXTO
  // Estes estados são compartilhados por toda a aplicação
  const [user, setUser] = useState<User | null>(null);      // Dados do usuário logado
  const [loading, setLoading] = useState(true);             // Estado de carregamento inicial

  // 6. EFEITO PARA VERIFICAR SE JÁ ESTÁ LOGADO
  // useEffect roda quando o componente é montado (carregado)
  useEffect(() => {
    // Função para verificar se o usuário já estava logado anteriormente
    const checkAuth = () => {
      try {
        // Busca o token e dados do usuário no localStorage do navegador
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        // Se encontrou tanto token quanto dados do usuário
        if (token && savedUser) {
          // Converte os dados do usuário de string JSON para objeto
          const userData = JSON.parse(savedUser);
          
          // Atualiza o estado com os dados do usuário
          setUser(userData);
          
          console.log('Usuário restaurado do localStorage:', userData);
        }
      } catch (error) {
        // Se houve erro ao ler localStorage, limpa os dados
        console.error('Erro ao restaurar sessão:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        // Sempre para o loading, independente do resultado
        setLoading(false);
      }
    };

    // Executa a verificação
    checkAuth();
  }, []); // Array vazio [] significa que roda apenas uma vez

  // 7. FUNÇÃO DE LOGIN
  // Esta função será chamada quando o usuário tentar fazer login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Chama o serviço de autenticação (que faz a requisição para o backend)
      const response = await authService.login(email, password);
      
      // Se o login foi bem-sucedido, salva os dados
      localStorage.setItem('token', response.token);                    // Salva o token JWT
      localStorage.setItem('user', JSON.stringify(response.user));      // Salva os dados do usuário
      
      // Atualiza o estado do contexto com o usuário logado
      setUser(response.user);
      
      console.log('Login realizado com sucesso:', response.user);
    } catch (error) {
      // Se houve erro no login, propaga o erro para o componente que chamou
      console.error('Erro no login:', error);
      throw error; // Relança o erro para o componente tratar
    }
  };

  // 8. FUNÇÃO DE REGISTRO
  // Similar ao login, mas para criar nova conta
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Chama o serviço para criar nova conta
      const response = await authService.register(name, email, password);
      
      // Salva os dados da mesma forma que o login
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Atualiza o estado
      setUser(response.user);
      
      console.log('Registro realizado com sucesso:', response.user);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // 9. FUNÇÃO DE LOGOUT
  // Remove todos os dados de autenticação
  const logout = (): void => {
    // Remove dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpa o estado do contexto
    setUser(null);
    
    console.log('Logout realizado');
  };

  // 10. VALORES COMPUTADOS
  // Estes valores são calculados baseados no estado atual
  const isAuthenticated = user !== null;           // Se tem usuário, está autenticado
  const isAdmin = user?.role === 'admin';          // Se o role for 'admin', é admin

  // 11. OBJETO COM TODOS OS VALORES DO CONTEXTO
  // Este objeto contém tudo que será disponibilizado para os componentes
  const contextValue: AuthContextType = {
    user,                    // Dados do usuário atual
    isAuthenticated,         // Boolean: está logado?
    isAdmin,                // Boolean: é admin?
    login,                  // Função para fazer login
    register,               // Função para fazer registro
    logout,                 // Função para fazer logout
    loading                 // Boolean: está carregando?
  };

  // 12. RETORNO DO PROVIDER
  // AuthContext.Provider é o componente que "fornece" os dados para toda a árvore de componentes
  // value={contextValue} define quais dados estarão disponíveis
  // {children} renderiza todos os componentes filhos que estão dentro do Provider
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};