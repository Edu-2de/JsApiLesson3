# Teste da API - Exemplos de Requisições

Este arquivo contém exemplos de requisições para testar a API da loja de produtos.

## Variáveis de Ambiente

Para facilitar os testes, defina:

- `BASE_URL=http://localhost:3000/api`

## Health Check

```bash
curl -X GET ${BASE_URL}/health
```

## Categorias

### Listar todas as categorias

```bash
curl -X GET ${BASE_URL}/categories
```

### Listar categorias com contagem de produtos

```bash
curl -X GET "${BASE_URL}/categories?include_product_count=true"
```

### Buscar categoria por ID

```bash
curl -X GET ${BASE_URL}/categories/1
```

### Criar nova categoria

```bash
curl -X POST ${BASE_URL}/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Informática",
    "description": "Equipamentos e acessórios de informática"
  }'
```

### Atualizar categoria

```bash
curl -X PUT ${BASE_URL}/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eletrônicos e Gadgets",
    "description": "Produtos eletrônicos, smartphones e gadgets"
  }'
```

### Deletar categoria

```bash
curl -X DELETE ${BASE_URL}/categories/6
```

## Produtos

### Listar todos os produtos

```bash
curl -X GET ${BASE_URL}/products
```

### Listar produtos com filtros

```bash
# Buscar por texto
curl -X GET "${BASE_URL}/products?search=smartphone"

# Filtrar por categoria
curl -X GET "${BASE_URL}/products?category_id=1"

# Filtrar por preço
curl -X GET "${BASE_URL}/products?min_price=100&max_price=500"

# Produtos ativos apenas
curl -X GET "${BASE_URL}/products?is_active=true"

# Ordenar por preço
curl -X GET "${BASE_URL}/products?sort_by=price&sort_order=ASC"

# Paginação
curl -X GET "${BASE_URL}/products?page=1&limit=5"

# Combinando filtros
curl -X GET "${BASE_URL}/products?category_id=1&min_price=500&sort_by=price&sort_order=DESC&page=1&limit=10"
```

### Buscar produto por ID

```bash
curl -X GET ${BASE_URL}/products/1
```

### Criar novo produto

```bash
curl -X POST ${BASE_URL}/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 14",
    "description": "Notebook Apple MacBook Pro 14 polegadas",
    "price": 12999.99,
    "stock_quantity": 5,
    "category_id": 1,
    "image_url": "https://example.com/macbook.jpg"
  }'
```

### Atualizar produto

```bash
curl -X PUT ${BASE_URL}/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone Samsung Galaxy S24",
    "description": "Smartphone Samsung Galaxy S24 com 256GB",
    "price": 1299.99,
    "stock_quantity": 25
  }'
```

### Atualizar estoque

```bash
# Adicionar ao estoque
curl -X PATCH ${BASE_URL}/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 10
  }'

# Remover do estoque
curl -X PATCH ${BASE_URL}/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": -5
  }'
```

### Deletar produto

```bash
curl -X DELETE ${BASE_URL}/products/6
```

## Testes com PowerShell (Windows)

### Listar produtos

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
```

### Criar categoria

```powershell
$body = @{
    name = "Teste PowerShell"
    description = "Categoria criada via PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method Post -Body $body -ContentType "application/json"
```

### Criar produto

```powershell
$body = @{
    name = "Produto Teste"
    description = "Produto criado via PowerShell"
    price = 99.99
    stock_quantity = 10
    category_id = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -Body $body -ContentType "application/json"
```

## Respostas Esperadas

### Sucesso

```json
{
  "success": true,
  "data": {
    /* dados do objeto */
  },
  "message": "Operação realizada com sucesso"
}
```

### Erro

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

### Lista paginada

```json
{
  "success": true,
  "data": [
    /* array de objetos */
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```
