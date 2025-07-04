const { query } = require('../database/connection');

// Listar todos os produtos
const getAllProducts = async (req, res) => {
    try {
        const { category_id, user_id, limit = 10, offset = 0 } = req.query;
        
        let queryText = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock_quantity,
                p.image_url,
                p.created_at,
                c.name as category_name,
                u.name as seller_name,
                u.phone as seller_phone
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.is_active = true
        `;
        
        const params = [];
        let paramIndex = 1;

        if (category_id) {
            queryText += ` AND p.category_id = $${paramIndex}`;
            params.push(category_id);
            paramIndex++;
        }

        if (user_id) {
            queryText += ` AND p.user_id = $${paramIndex}`;
            params.push(user_id);
            paramIndex++;
        }

        queryText += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);
        
        res.json({
            status: 'success',
            data: result.rows,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: result.rowCount
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar produtos',
            error: error.message
        });
    }
};

// Buscar produto por ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT 
                p.*,
                c.name as category_name,
                u.name as seller_name,
                u.phone as seller_phone,
                u.email as seller_email
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.id = $1 AND p.is_active = true
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar produto',
            error: error.message
        });
    }
};

// Criar novo produto
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id, user_id, image_url } = req.body;
        
        const result = await query(
            'INSERT INTO products (name, description, price, stock_quantity, category_id, user_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, description, price, stock_quantity, category_id, user_id, image_url]
        );
        
        res.status(201).json({
            status: 'success',
            message: 'Produto criado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao criar produto',
            error: error.message
        });
    }
};

// Atualizar produto
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity, category_id, image_url } = req.body;
        
        const result = await query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, image_url = $6 WHERE id = $7 AND is_active = true RETURNING *',
            [name, description, price, stock_quantity, category_id, image_url, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Produto atualizado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar produto',
            error: error.message
        });
    }
};

// Deletar produto (soft delete)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await query(
            'UPDATE products SET is_active = false WHERE id = $1 AND is_active = true RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Produto não encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Produto removido com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao remover produto',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
