# Configuração do Banco de Dados PostgreSQL

## Instalação do PostgreSQL

### Windows

1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador e siga as instruções
3. Anote a senha do usuário `postgres`

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS

```bash
brew install postgresql
brew services start postgresql
```

## Configuração Inicial

1. Acesse o PostgreSQL:

```bash
# Windows
psql -U postgres

# Linux/macOS
sudo -u postgres psql
```

2. Crie o banco de dados:

```sql
CREATE DATABASE loja_produtos;
```

3. Crie um usuário específico (opcional):

```sql
CREATE USER loja_user WITH PASSWORD 'sua_senha_aqui';
GRANT ALL PRIVILEGES ON DATABASE loja_produtos TO loja_user;
```

4. Configure o arquivo `.env` com as credenciais corretas

## Executar Setup das Tabelas

Após configurar o banco de dados, execute:

```bash
npm run db:setup
```

Este comando criará as tabelas e inserirá dados iniciais de exemplo.

## Verificar Conexão

Para testar se a conexão está funcionando:

```bash
npm run dev
```

Acesse: http://localhost:3000/api/health

## Problemas Comuns

### Erro de Conexão

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados existe

### Erro de Permissão

- Verifique as permissões do usuário no banco
- Certifique-se de que o usuário tem acesso ao banco de dados

### Porta em Uso

- Altere a porta no arquivo `.env` se necessário
- Verifique se nenhum outro processo está usando a porta
