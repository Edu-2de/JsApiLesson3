# 🛒 E-commerce API - Sistema Completo

API RESTful para sistema de e-commerce com autenticação JWT, gestão de produtos, categorias, usuários e transações.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Testes](#-testes)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Banco](#-estrutura-do-banco)
- [Middleware](#-middleware)
- [Contribuição](#-contribuição)

## ✨ Características

- ✅ **Autenticação JWT** com roles (admin/user)
- ✅ **CRUD completo** para usuários, produtos e categorias
- ✅ **Sistema de carrinho** e processamento de pedidos
- ✅ **Gestão de transações** e saldo de usuários
- ✅ **Controle de estoque** automático
- ✅ **Middleware de segurança** (rate limiting, validação, logs)
- ✅ **Testes automatizados** (85 testes com 99% de cobertura)
- ✅ **Banco PostgreSQL** com transações atômicas
- ✅ **Documentação completa** da API

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing

### Testes
- **Jest** - Framework de testes
- **ts-jest** - Preprocessor TypeScript
- **Supertest** - Testes de API

### Frontend (2 versões)
- **Next.js** (React com SSR)
- **Vite + React** (SPA)

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd JsApiLesson3
```

### 2. Instale as dependências do backend
```bash
cd lesson/backend
npm install
```

### 3. Instale as dependências do frontend (opcional)
```bash
# Next.js
cd ../frontend
npm install

# OU Vite + React
cd ../frontend2
npm install
```

## ⚙️ Configuração

### 1. Banco de dados PostgreSQL

Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE lesson;
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lesson
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura

# Server
PORT=3001
```

### 3. Setup automático

O sistema criará automaticamente as tabelas e dados iniciais no primeiro boot.

## 🚀 Executando o Projeto

### Backend
```bash
cd lesson/backend

# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

### Frontend Next.js
```bash
cd lesson/frontend
npm run dev
```

### Frontend Vite
```bash
cd lesson/frontend2
npm run dev
```

## 🧪 Testes

O projeto possui **85 testes automatizados** cobrindo todos os controllers.

### Executar todos os testes
```bash
cd lesson/backend
npm test
```

### Executar com observação (watch mode)
```bash
npm run test:watch
```

### Executar com relatório de cobertura
```bash
npm run test:coverage
```

### Resultados dos testes
```
✅ Test Suites: 6 passed, 6 total
✅ Tests: 85 passed, 85 total  
✅ Coverage: 99% nos controllers
⏱️ Time: ~6-16 segundos
```

## 📚 Documentação da API

**Base URL:** `http://localhost:3001`

### 🔐 Autenticação

#### POST `/auth/register`
Registrar novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com", 
  "password": "senha123"
}
```

#### POST `/auth/login`
Fazer login
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### GET `/auth/profile`
Obter perfil do usuário (requer token)
```bash
Authorization: Bearer SEU_JWT_TOKEN
```

### 👥 Usuários

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/users` | Listar usuários | Admin |
| GET | `/users/:id` | Buscar usuário | Owner/Admin |
| POST | `/users` | Criar usuário | Admin |
| PUT | `/users/:id` | Atualizar usuário | Owner/Admin |
| DELETE | `/users/:id` | Deletar usuário | Admin |

#### Exemplo - Criar usuário:
```json
POST /users
Authorization: Bearer ADMIN_TOKEN

{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "password": "senha123"
}
```

### 🛍️ Produtos

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/products` | Listar produtos | Público |
| GET | `/products/search` | Buscar com filtros | Público |
| GET | `/products/:id` | Buscar produto | Público |
| POST | `/products` | Criar produto | Admin |
| PUT | `/products/:id` | Atualizar produto | Admin |
| DELETE | `/products/:id` | Deletar produto | Admin |

#### Exemplo - Criar produto:
```json
POST /products
Authorization: Bearer ADMIN_TOKEN

{
  "name": "Notebook Dell",
  "description": "Notebook Dell Inspiron 15",
  "price": 2500.00,
  "stock_quantity": 10,
  "category_id": 2
}
```

#### Exemplo - Buscar com filtros:
```bash
GET /products/search?name=notebook&min_price=1000&max_price=3000&in_stock=true
```

### 📂 Categorias

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/categories` | Listar categorias | Público |
| GET | `/categories/:id` | Buscar categoria | Público |
| GET | `/categories/:id/products` | Produtos da categoria | Público |
| POST | `/categories` | Criar categoria | Público |
| PUT | `/categories/:id` | Atualizar categoria | Público |
| DELETE | `/categories/:id` | Deletar categoria | Público |

#### Exemplo - Criar categoria:
```json
POST /categories

{
  "name": "Smartphones",
  "description": "Celulares e smartphones"
}
```

### 💰 Transações

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| POST | `/transactions/add-balance` | Adicionar saldo | Admin |
| GET | `/transactions/balance/:user_id` | Consultar saldo | Owner/Admin |
| GET | `/transactions/transactions/:user_id` | Histórico | Owner/Admin |

#### Exemplo - Adicionar saldo:
```json
POST /transactions/add-balance
Authorization: Bearer ADMIN_TOKEN

{
  "user_id": 1,
  "amount": 500.00,
  "description": "Depósito inicial"
}
```

### 🛒 Compras

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| POST | `/transactions/purchase` | Realizar compra | Usuário |
| GET | `/transactions/orders/:user_id` | Listar pedidos | Owner/Admin |

#### Exemplo - Realizar compra:
```json
POST /transactions/purchase
Authorization: Bearer USER_TOKEN

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2, 
      "quantity": 1
    }
  ]
}
```

### 🔧 Utilitários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da API |
| GET | `/test-db` | Teste do banco |

## 🗄️ Estrutura do Banco

### Tabelas Principais

#### `users` - Usuários
```sql
id, name, email, password_hash, role, balance, is_active, created_at, updated_at
```

#### `categories` - Categorias
```sql
id, name, description, created_at, updated_at
```

#### `products` - Produtos
```sql
id, name, description, price, stock_quantity, category_id, created_at, updated_at
```

#### `orders` - Pedidos
```sql
id, user_id, total_amount, status, created_at, updated_at
```

#### `order_items` - Itens do Pedido
```sql
id, order_id, product_id, quantity, price, created_at
```

#### `transactions` - Transações
```sql
id, user_id, type, amount, description, order_id, created_at
```

### Usuário Admin Padrão
```
Email: admin@system.com
Senha: password (será hasheada automaticamente)
Role: admin
Saldo: R$ 10.000,00
```

## 🛡️ Middleware

### Autenticação
- **`authenticateToken`** - Verifica JWT válido
- **`requireAdmin`** - Requer role admin
- **`requireOwnerOrAdmin`** - Requer ser dono do recurso ou admin

### Validação
- **`validateId`** - Valida parâmetros ID
- **`validateProduct`** - Valida dados de produto

### Segurança
- **`rateLimit`** - Limite de requisições (100/15min)
- **`helmet`** - Headers de segurança
- **`cors`** - Cross-origin requests
- **`logger`** - Log de requisições

### Tratamento de Erros
- **`errorHandler`** - Tratamento global de erros

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Erro de validação |
| 401 | Não autorizado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

## 🔒 Autenticação JWT

### Obter Token
1. Registre-se em `/auth/register` OU
2. Faça login em `/auth/login`
3. Use o token retornado no header: `Authorization: Bearer SEU_TOKEN`

### Estrutura do Token
```json
{
  "id": 1,
  "email": "user@email.com", 
  "role": "user"
}
```

### Expiração
- Tokens expiram em **24 horas**
- Renovação necessária via novo login

## 📁 Estrutura do Projeto

```
lesson/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── routes/          # Definição de rotas
│   │   ├── database/        # Conexão e esquema DB
│   │   └── __tests__/       # Testes automatizados
│   ├── package.json
│   └── jest.config.js
├── frontend/                # Next.js
└── frontend2/               # Vite + React
```

## 🚨 Troubleshooting

### Erro de conexão com banco
1. Verifique se PostgreSQL está rodando
2. Confirme credenciais no `.env`
3. Teste conexão: `GET /test-db`

### Erro de autenticação
1. Verifique se token está no header
2. Confirme formato: `Bearer TOKEN`
3. Token pode ter expirado (24h)

### Erro nos testes
```bash
# Limpar cache do Jest
npm test -- --clearCache

# Executar testes individuais
npm test authController.test.ts
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma **Issue** no GitHub
2. Consulte a documentação dos testes em `TESTS.md`
3. Verifique logs do servidor para erros específicos

---

**Desenvolvido com ❤️ usando TypeScript + Express + PostgreSQL**