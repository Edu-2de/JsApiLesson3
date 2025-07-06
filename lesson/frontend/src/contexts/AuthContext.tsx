'use client';

// 1. IMPORTAÇÕES NECESSÁRIAS
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth';

// 2. DEFININDO O TIPO DO CONTEXTO
// Esta interface define exatamente quais dados e funções estarão disponíveis
// para todos os componentes que usarem este contexto de autenticação
interface AuthContextType {
  user: User | null;              // Dados do usuário logado (null se não estiver logado)
  isAuthenticated: boolean;       // true se estiver logado, false se não estiver
  isAdmin: boolean;              // true se o usuário for administrador
  login: (email: string, password: string) => Promise<void>;    // Função para fazer login
  register: (name: string, email: string, password: string) => Promise<void>; // Função para registrar
  logout: () => void;            // Função para fazer logout
  loading: boolean;              // true enquanto está verificando se o usuário já estava logado
}

// 3. CRIANDO O CONTEXTO
// createContext cria um "espaço compartilhado" onde os dados de autenticação ficarão
// O valor inicial é undefined, mas será preenchido pelo AuthProvider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. COMPONENTE PROVIDER (PROVEDOR)
// Este componente vai "envolver" toda a aplicação e fornecer os dados de autenticação
// para todos os componentes filhos
export function AuthProvider({ children }: { children: ReactNode }) {
  
  // 5. ESTADOS LOCAIS DO CONTEXTO
  // Estes estados serão compartilhados por toda a aplicação
  const [user, setUser] = useState<User | null>(null);      // Armazena os dados do usuário logado
  const [loading, setLoading] = useState(true);             // Controla o estado de carregamento inicial

  // 6. EFEITO PARA VERIFICAR AUTENTICAÇÃO EXISTENTE
  // useEffect executa quando o componente é montado (app inicia)
  // Verifica se o usuário já estava logado anteriormente
  useEffect(() => {
    // Busca o token JWT e dados do usuário salvos no localStorage do navegador
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // Se encontrou tanto o token quanto os dados do usuário salvos
    if (token && savedUser) {
      // Converte os dados do usuário de string JSON para objeto JavaScript
      // e atualiza o estado do contexto
      setUser(JSON.parse(savedUser));
    }
    
    // Para o loading, indicando que a verificação inicial foi concluída
    setLoading(false);
  }, []); // Array vazio [] significa que executa apenas uma vez, quando o componente monta

  // 7. FUNÇÃO DE LOGIN
  // Esta função será chamada pelos componentes quando o usuário tentar fazer login
  const login = async (email: string, password: string) => {
    // Chama o serviço de autenticação que faz a requisição HTTP para o backend
    const response = await authService.login(email, password);
    
    // Se o login foi bem-sucedido, salva os dados no localStorage
    localStorage.setItem('token', response.token);                    // Salva o token JWT
    localStorage.setItem('user', JSON.stringify(response.user));      // Salva os dados do usuário
    
    // Atualiza o estado do contexto com os dados do usuário
    // Isso fará com que todos os componentes que usam useAuth sejam re-renderizados
    setUser(response.user);
  };

  // 8. FUNÇÃO DE REGISTRO
  // Similar ao login, mas para criar uma nova conta de usuário
  const register = async (name: string, email: string, password: string) => {
    // Chama o serviço para criar nova conta no backend
    const response = await authService.register(name, email, password);
    
    // Salva os dados da mesma forma que o login
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Atualiza o estado do contexto
    setUser(response.user);
  };

  // 9. FUNÇÃO DE LOGOUT
  // Remove todos os dados de autenticação e desloga o usuário
  const logout = () => {
    // Remove o token e dados do usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpa o estado do contexto, definindo user como null
    // Isso fará com que isAuthenticated se torne false automaticamente
    setUser(null);
  };

  // 10. RETORNO DO PROVIDER
  // AuthContext.Provider é o componente que "distribui" os dados para toda a árvore de componentes
  // O objeto 'value' contém todos os dados e funções que estarão disponíveis para os componentes filhos
  return (
    <AuthContext.Provider value={{
      user,                               // Dados do usuário atual
      isAuthenticated: !!user,           // Converte user em boolean: true se user existe, false se é null
      isAdmin: user?.role === 'admin',   // Verifica se o role do usuário é 'admin'
      login,                             // Função para fazer login
      register,                          // Função para fazer registro
      logout,                            // Função para fazer logout
      loading                            // Estado de carregamento
    }}>
      {children}  {/* Renderiza todos os componentes filhos que estão dentro do Provider */}
    </AuthContext.Provider>
  );
}

// 11. HOOK PERSONALIZADO PARA USAR O CONTEXTO
// Este hook facilita o uso do contexto nos componentes
export const useAuth = () => {
  // useContext acessa os dados do AuthContext
  const context = useContext(AuthContext);
  
  // Verificação de segurança: se o contexto for undefined, significa que
  // o componente está sendo usado fora do AuthProvider (isso é um erro)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Retorna todos os valores e funções do contexto
  return context;
};