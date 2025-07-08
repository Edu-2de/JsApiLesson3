# 👑 Guia de Administração - Gestão de Usuários

Este guia explica as funcionalidades administrativas para criação e gestão de usuários com diferentes roles.

## 🔐 Permissões de Administrador

### O que um Admin pode fazer:

- ✅ **Criar novos usuários** com qualquer role (user/admin)
- ✅ **Visualizar todos os usuários** do sistema
- ✅ **Atualizar qualquer usuário** (nome, email, role, status)
- ✅ **Deletar usuários** do sistema
- ✅ **Gerenciar saldo** de usuários
- ✅ **Criar produtos** e categorias
- ✅ **Visualizar pedidos** de qualquer usuário

### O que um User pode fazer:

- ✅ **Visualizar seu próprio perfil**
- ✅ **Atualizar seus próprios dados** (nome, email)
- ✅ **Fazer compras** e visualizar seus pedidos
- ✅ **Consultar produtos** e categorias
- ❌ **NÃO pode** criar outros usuários
- ❌ **NÃO pode** alterar roles
- ❌ **NÃO pode** gerenciar produtos/categorias

## 👥 Criando Usuários como Admin

### 1. Criar Usuário Normal

```bash
POST /users
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "password": "minhasenha123"
  // role será "user" por padrão
}
```

### 2. Criar Administrador

```bash
POST /users
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "Maria Admin",
  "email": "maria.admin@email.com",
  "password": "senhaAdmin123",
  "role": "admin"
}
```

### 3. Campos Disponíveis na Criação

| Campo      | Tipo   | Obrigatório | Descrição                          |
| ---------- | ------ | ----------- | ---------------------------------- |
| `name`     | string | ✅          | Nome completo                      |
| `email`    | string | ✅          | Email único                        |
| `password` | string | ✅          | Mínimo 6 caracteres                |
| `role`     | string | ❌          | "user" ou "admin" (padrão: "user") |

## ✏️ Atualizando Usuários

### 1. Atualizar Dados Básicos

```bash
PUT /users/123
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.santos@email.com"
}
```

### 2. Promover Usuário a Admin

```bash
PUT /users/123
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "role": "admin"
}
```

### 3. Desativar Usuário

```bash
PUT /users/123
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "is_active": false
}
```

### 4. Rebaixar Admin para User

```bash
PUT /users/123
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "role": "user"
}
```

### 5. Campos Disponíveis na Atualização

| Campo       | Tipo    | Descrição         |
| ----------- | ------- | ----------------- |
| `name`      | string  | Nome completo     |
| `email`     | string  | Email único       |
| `role`      | string  | "user" ou "admin" |
| `is_active` | boolean | Status do usuário |

## 📋 Listando Usuários

### Ver Todos os Usuários

```bash
GET /users
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Resposta:**

```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "id": 1,
      "name": "Admin Sistema",
      "email": "admin@system.com",
      "role": "admin",
      "balance": 10000.0,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "balance": 500.0,
      "is_active": true,
      "created_at": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

## 🔍 Visualizando Usuário Específico

```bash
GET /users/123
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Resposta:**

```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": 123,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "balance": 500.0,
    "is_active": true,
    "created_at": "2024-01-02T00:00:00.000Z"
  }
}
```

## 🗑️ Deletando Usuários

```bash
DELETE /users/123
Authorization: Bearer ADMIN_JWT_TOKEN
```

**⚠️ CUIDADO:** Esta ação é irreversível e remove:

- O usuário
- Seus pedidos
- Seu histórico de transações

## 🛡️ Validações de Segurança

### Email

- ✅ Deve ter formato válido
- ✅ Deve ser único no sistema
- ❌ Não pode ser duplicado

### Senha

- ✅ Mínimo 6 caracteres
- ✅ Automaticamente hasheada com bcrypt
- ❌ Nunca armazenada em texto plano

### Role

- ✅ Apenas "user" ou "admin"
- ❌ Valores inválidos são rejeitados

## 🔄 Casos de Uso Comuns

### 1. Onboarding de Novo Funcionário

```bash
# 1. Criar usuário normal
POST /users { "name": "...", "email": "...", "password": "..." }

# 2. Adicionar saldo inicial (se necessário)
POST /transactions/add-balance { "user_id": X, "amount": 1000 }

# 3. Promover a admin (se necessário)
PUT /users/X { "role": "admin" }
```

### 2. Suspender Usuário Problemático

```bash
# Desativar sem deletar (preserva histórico)
PUT /users/123 { "is_active": false }
```

### 3. Reativar Usuário

```bash
PUT /users/123 { "is_active": true }
```

### 4. Auditoria de Usuários

```bash
# Listar todos para análise
GET /users

# Ver detalhes específicos
GET /users/123

# Ver transações do usuário
GET /transactions/transactions/123
```

## 🚨 Boas Práticas

### ✅ DO's

- Sempre use senhas fortes para admins
- Mantenha poucos usuários com role "admin"
- Monitore atividades de usuários admin
- Use `is_active: false` em vez de deletar quando possível
- Verifique dados antes de criar/atualizar

### ❌ DON'Ts

- Não compartilhe tokens de admin
- Não crie admins desnecessariamente
- Não delete usuários com histórico importante
- Não use senhas fracas
- Não ignore validações de email

## 🔧 Troubleshooting

### Erro: "Email already exists"

```bash
# Verificar se email já está em uso
GET /users
# Procurar pelo email na lista
```

### Erro: "User not found"

```bash
# Verificar se ID existe
GET /users/123
```

### Erro: "Insufficient permissions"

```bash
# Verificar se token é de admin
GET /auth/profile
# Confirmar role: "admin"
```

---

**⚡ Dica:** Use o Postman ou Insomnia para testar as rotas facilmente!
