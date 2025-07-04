import { Database } from './database';

async function setupDatabase() {
  const db = Database.getInstance();

  try {
    console.log('🔄 Configurando banco de dados...');

    // Criar tabela de categorias
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de produtos
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id)
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)
    `);

    // Inserir dados iniciais de categorias
    await db.query(`
      INSERT INTO categories (name, description) VALUES 
      ('Eletrônicos', 'Produtos eletrônicos e gadgets'),
      ('Roupas', 'Vestuário e acessórios'),
      ('Casa', 'Itens para casa e decoração'),
      ('Esportes', 'Artigos esportivos e fitness'),
      ('Livros', 'Livros e material educativo')
      ON CONFLICT (name) DO NOTHING
    `);

    // Inserir dados iniciais de produtos
    await db.query(`
      INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES 
      ('Smartphone Samsung Galaxy', 'Smartphone com 128GB de armazenamento', 999.99, 50, 1, 'https://example.com/smartphone.jpg'),
      ('Notebook Dell', 'Notebook para trabalho e estudos', 2499.99, 20, 1, 'https://example.com/notebook.jpg'),
      ('Camiseta Básica', 'Camiseta 100% algodão', 29.99, 100, 2, 'https://example.com/camiseta.jpg'),
      ('Tênis Esportivo', 'Tênis para corrida e caminhada', 199.99, 75, 4, 'https://example.com/tenis.jpg'),
      ('Livro JavaScript', 'Aprenda JavaScript do básico ao avançado', 49.99, 30, 5, 'https://example.com/livro.jpg')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Banco de dados configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    throw error;
  }
}

// Executar setup se chamado diretamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Setup completo!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro durante setup:', error);
      process.exit(1);
    });
}

export { setupDatabase };
