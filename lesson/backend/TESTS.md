# Testes Automatizados - Backend API

Este projeto inclui uma suíte completa de testes automatizados para todos os controllers da API.

## Estrutura dos Testes

```
src/
├── __tests__/
│   ├── setup.ts                    # Configuração global dos testes
│   ├── authController.test.ts      # Testes para autenticação
│   ├── userController.test.ts      # Testes para usuários
│   ├── productController.test.ts   # Testes para produtos
│   ├── categoryController.test.ts  # Testes para categorias
│   ├── transactionController.test.ts # Testes para transações
│   └── purchaseController.test.ts  # Testes para compras
└── controllers/
    ├── authController.ts
    ├── userController.ts
    ├── productController.ts
    ├── categoryController.ts
    ├── transactionController.ts
    └── purchaseController.ts
```

## Tecnologias Utilizadas

- **Jest**: Framework de testes
- **ts-jest**: Preprocessor TypeScript para Jest
- **Supertest**: Biblioteca para testar APIs HTTP
- **Mocks**: Simulação de banco de dados e dependências

## Scripts Disponíveis

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (observação)
```bash
npm run test:watch
```

### Executar testes com coverage (cobertura)
```bash
npm run test:coverage
```

## Cobertura dos Testes

### AuthController
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas
- ✅ Login com conta inativa
- ✅ Registro de novo usuário
- ✅ Validações de email e senha
- ✅ Buscar perfil do usuário
- ✅ Tratamento de erros

### UserController
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID
- ✅ Criar novo usuário
- ✅ Atualizar usuário existente
- ✅ Deletar usuário
- ✅ Validações de entrada
- ✅ Tratamento de erros

### ProductController
- ✅ Listar todos os produtos
- ✅ Buscar produto por ID
- ✅ Criar novo produto
- ✅ Atualizar produto existente
- ✅ Deletar produto
- ✅ Buscar produtos por filtros
- ✅ Validações de preço e categoria
- ✅ Tratamento de erros

### CategoryController
- ✅ Listar todas as categorias
- ✅ Buscar categoria por ID
- ✅ Criar nova categoria
- ✅ Atualizar categoria existente
- ✅ Deletar categoria
- ✅ Buscar produtos por categoria
- ✅ Validação de nome único
- ✅ Tratamento de erros

### TransactionController
- ✅ Adicionar saldo ao usuário
- ✅ Consultar saldo do usuário
- ✅ Histórico de transações
- ✅ Validações de valores
- ✅ Tratamento de erros

### PurchaseController
- ✅ Realizar compra com sucesso
- ✅ Validação de itens
- ✅ Verificação de estoque
- ✅ Verificação de saldo
- ✅ Transações atômicas (rollback)
- ✅ Listar pedidos do usuário
- ✅ Tratamento de erros

## Configuração dos Mocks

O arquivo `setup.ts` configura os mocks para:
- **Database Pool**: Simula conexões com PostgreSQL
- **bcryptjs**: Simula hash e comparação de senhas
- **jsonwebtoken**: Simula geração e verificação de tokens

## Executando os Testes

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar todos os testes**:
   ```bash
   npm test
   ```

3. **Ver cobertura detalhada**:
   ```bash
   npm run test:coverage
   ```

## Interpretando os Resultados

### Resultado Esperado
```
Test Suites: 6 passed, 6 total
Tests:       XX passed, XX total
Snapshots:   0 total
Time:        X.XXXs
```

### Coverage Report
O relatório de cobertura mostra:
- **Statements**: Linhas de código executadas
- **Branches**: Caminhos condicionais testados
- **Functions**: Funções testadas
- **Lines**: Linhas de código cobertas

## Boas Práticas Implementadas

1. **Isolamento**: Cada teste é independente
2. **Mocks**: Simulação de dependências externas
3. **Casos de Erro**: Testes para cenários de falha
4. **Validações**: Testes para todas as validações de entrada
5. **Cenários Reais**: Testes baseados em casos de uso reais

## Adicionando Novos Testes

Para adicionar novos testes:

1. Crie o arquivo de teste na pasta `__tests__/`
2. Importe o controller a ser testado
3. Configure os mocks necessários
4. Escreva os casos de teste seguindo o padrão AAA:
   - **Arrange**: Preparar dados
   - **Act**: Executar ação
   - **Assert**: Verificar resultado

### Exemplo de Estrutura
```typescript
describe('NomeController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    // Setup dos mocks
  });

  describe('metodo', () => {
    it('should do something successfully', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```
