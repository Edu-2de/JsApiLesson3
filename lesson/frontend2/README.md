# Frontend React - Loja Virtual

Este é um frontend React puro (sem Next.js) que se integra com o backend da loja virtual. Desenvolvido usando Vite + React + TypeScript.

## 🚀 Funcionalidades

### Públicas

- ✅ Página inicial com produtos em destaque
- ✅ Autenticação (login/registro)
- ✅ Listagem de produtos
- ✅ Detalhes de produtos
- ✅ Navegação responsiva

### Autenticadas

- ✅ Carrinho de compras
- ✅ Perfil do usuário
- ✅ Histórico de pedidos
- ✅ Gestão de saldo

### Administrativas

- ✅ Dashboard administrativo
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de categorias
- ✅ Gerenciamento de pedidos

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Ferramenta de build e desenvolvimento
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado global

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

### Configuração do Backend

Certifique-se de que o backend está rodando na porta 3000. O frontend fará requisições para:

```
http://localhost:3000/api
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx       # Layout principal
│   ├── Header.tsx       # Cabeçalho
│   ├── Footer.tsx       # Rodapé
│   ├── ProtectedRoute.tsx  # Proteção de rotas
│   └── AdminRoute.tsx   # Proteção de rotas admin
├── contexts/            # Context API
│   ├── AuthContext.tsx  # Contexto de autenticação
│   └── CartContext.tsx  # Contexto do carrinho
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Hook de autenticação
│   └── useCart.ts       # Hook do carrinho
├── lib/                 # Utilitários
│   ├── api.ts           # Configuração do Axios
│   └── utils.ts         # Funções utilitárias
├── pages/               # Páginas da aplicação
│   ├── Home.tsx         # Página inicial
│   ├── Login.tsx        # Login
│   ├── Register.tsx     # Registro
│   ├── Products.tsx     # Listagem de produtos
│   ├── ProductDetail.tsx # Detalhes do produto
│   ├── Cart.tsx         # Carrinho
│   ├── Profile.tsx      # Perfil do usuário
│   ├── Orders.tsx       # Pedidos
│   ├── OrderDetail.tsx  # Detalhes do pedido
│   └── Admin*.tsx       # Páginas administrativas
├── services/            # Serviços da API
│   ├── auth.ts          # Autenticação
│   ├── products.ts      # Produtos
│   ├── categories.ts    # Categorias
│   ├── users.ts         # Usuários
│   ├── transactions.ts  # Transações
│   └── orders.ts        # Pedidos
├── types/               # Tipos TypeScript
│   └── index.ts         # Tipos da aplicação
├── App.tsx              # Componente principal
├── App.css              # Estilos principais
└── main.tsx             # Ponto de entrada
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. **Login/Registro**: Usuário fornece credenciais
2. **Token**: Backend retorna JWT token
3. **Armazenamento**: Token salvo no localStorage
4. **Interceptor**: Axios adiciona token em todas as requisições
5. **Proteção**: Rotas protegidas verificam autenticação

## 🛒 Carrinho de Compras

O carrinho é gerenciado via Context API:

- **Persistência**: Salvo no localStorage
- **Estado Global**: Disponível em toda aplicação
- **Sincronização**: Atualiza automaticamente a UI

## 👥 Tipos de Usuário

### Usuário Comum

- Visualizar produtos
- Adicionar ao carrinho
- Fazer pedidos
- Visualizar histórico

### Administrador

- Todas as funções do usuário comum
- Gerenciar produtos
- Gerenciar categorias
- Gerenciar usuários
- Visualizar estatísticas

## 📱 Responsividade

O projeto é totalmente responsivo:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado
- **Mobile**: Menu hamburger e layout otimizado

## 🎨 Estilização

Utiliza CSS puro com classes utilitárias inspiradas no Tailwind:

- Sistema de grid responsivo
- Flexbox
- Animações e transições
- Paleta de cores consistente

## 🔄 Integração com Backend

### Endpoints Utilizados

**Autenticação:**

- POST `/auth/login` - Login
- POST `/auth/register` - Registro
- GET `/auth/profile` - Perfil atual

**Produtos:**

- GET `/products` - Listar produtos
- GET `/products/:id` - Detalhes do produto
- POST `/products` - Criar produto (admin)
- PUT `/products/:id` - Atualizar produto (admin)
- DELETE `/products/:id` - Deletar produto (admin)

**Categorias:**

- GET `/categories` - Listar categorias
- POST `/categories` - Criar categoria (admin)
- PUT `/categories/:id` - Atualizar categoria (admin)
- DELETE `/categories/:id` - Deletar categoria (admin)

**Pedidos:**

- GET `/orders` - Listar pedidos
- POST `/orders` - Criar pedido
- GET `/orders/:id` - Detalhes do pedido

**Usuários:**

- GET `/users` - Listar usuários (admin)
- PUT `/users/:id` - Atualizar usuário (admin)
- POST `/users/:id/balance` - Adicionar saldo (admin)

## 📊 Estado da Aplicação

### Contextos Globais

1. **AuthContext**: Gerencia autenticação

   - Usuário atual
   - Estado de login
   - Funções de login/logout

2. **CartContext**: Gerencia carrinho
   - Itens do carrinho
   - Quantidades
   - Total

## 🚨 Tratamento de Erros

- **Interceptors**: Axios intercepta erros automaticamente
- **Feedback**: Mensagens de erro claras para o usuário
- **Fallbacks**: Estados de loading e error

## 📝 Próximos Passos

- [ ] Implementar notificações toast
- [ ] Adicionar paginação nos produtos
- [ ] Implementar busca avançada
- [ ] Adicionar filtros por categoria
- [ ] Implementar chat de suporte
- [ ] Adicionar sistema de reviews
- [ ] Implementar wishlist
- [ ] Adicionar modo escuro

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
