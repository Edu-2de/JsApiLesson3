# API da Loja de Produtos

Backend desenvolvido em TypeScript com Express e PostgreSQL para gerenciar produtos e categorias de uma loja.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver PostgreSQL para Node.js

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

   - Copie o arquivo `.env.example` para `.env`
   - Configure as variáveis de acordo com seu ambiente

4. Configure o banco de dados:

```bash
npm run db:setup
```

## 🎯 Scripts Disponíveis

- `npm run dev` - Executa o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa o servidor em produção
- `npm run db:setup` - Configura as tabelas do banco de dados

## 🗄️ Estrutura do Banco de Dados

### Tabela `categories`

- `id` - Chave primária
- `name` - Nome da categoria (único)
- `description` - Descrição da categoria
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela `products`

- `id` - Chave primária
- `name` - Nome do produto
- `description` - Descrição do produto
- `price` - Preço do produto
- `stock_quantity` - Quantidade em estoque
- `category_id` - Chave estrangeira para categoria
- `image_url` - URL da imagem do produto
- `is_active` - Status do produto (ativo/inativo)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

## 📚 Endpoints da API

### Produtos

#### GET /api/products

Lista todos os produtos com filtros e paginação.

**Query Parameters:**

- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `search` - Busca por nome ou descrição
- `category_id` - Filtrar por categoria
- `min_price` - Preço mínimo
- `max_price` - Preço máximo
- `is_active` - Filtrar por status (true/false)
- `sort_by` - Ordenar por (name, price, created_at)
- `sort_order` - Ordem (ASC, DESC)

**Exemplo:**

```
GET /api/products?page=1&limit=10&search=smartphone&category_id=1&sort_by=price&sort_order=ASC
```

#### GET /api/products/:id

Busca um produto específico por ID.

#### POST /api/products

Cria um novo produto.

**Body:**

```json
{
  "name": "Smartphone Samsung Galaxy",
  "description": "Smartphone com 128GB de armazenamento",
  "price": 999.99,
  "stock_quantity": 50,
  "category_id": 1,
  "image_url": "https://example.com/smartphone.jpg"
}
```

#### PUT /api/products/:id

Atualiza um produto existente.

#### DELETE /api/products/:id

Remove um produto.

#### PATCH /api/products/:id/stock

Atualiza o estoque de um produto.

**Body:**

```json
{
  "quantity": 10
}
```

### Categorias

#### GET /api/categories

Lista todas as categorias.

**Query Parameters:**

- `include_product_count` - Incluir contagem de produtos (true/false)

#### GET /api/categories/:id

Busca uma categoria específica por ID.

#### POST /api/categories

Cria uma nova categoria.

**Body:**

```json
{
  "name": "Eletrônicos",
  "description": "Produtos eletrônicos e gadgets"
}
```

#### PUT /api/categories/:id

Atualiza uma categoria existente.

#### DELETE /api/categories/:id

Remove uma categoria (apenas se não houver produtos associados).

### Health Check

#### GET /api/health

Verifica se a API está funcionando.

## 🔒 Estrutura de Pastas

```
src/
├── controllers/       # Controladores da API
├── database/         # Configuração do banco de dados
├── middleware/       # Middlewares personalizados
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Definições de tipos TypeScript
└── server.ts        # Arquivo principal do servidor
```

## 🛠️ Desenvolvimento

Para executar em modo desenvolvimento:

```bash
npm run dev
```

O servidor será executado em `http://localhost:3000` com hot-reload habilitado.

## 📝 Exemplo de Uso

### Criar uma categoria:

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Eletrônicos", "description": "Produtos eletrônicos"}'
```

### Criar um produto:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 14",
    "description": "Smartphone Apple",
    "price": 4999.99,
    "stock_quantity": 10,
    "category_id": 1
  }'
```

### Listar produtos:

```bash
curl http://localhost:3000/api/products
```

## 🚨 Tratamento de Erros

A API retorna respostas estruturadas para erros:

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "stack": "Stack trace (apenas em desenvolvimento)"
}
```

## 📊 Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor
