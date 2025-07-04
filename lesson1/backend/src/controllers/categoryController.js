const { query } = require('../database/connection');

// Listar todas as categorias
const getAllCategories = async (req, res) => {
    try {
        const result = await query('SELECT * FROM categories WHERE is_active = true ORDER BY name');
        res.json({
            status: 'success',
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar categorias',
            error: error.message
        });
    }
};

// Buscar categoria por ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM categories WHERE id = $1 AND is_active = true', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Categoria não encontrada'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar categoria',
            error: error.message
        });
    }
};

// Criar nova categoria
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const result = await query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        
        res.status(201).json({
            status: 'success',
            message: 'Categoria criada com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({
                status: 'error',
                message: 'Categoria já existe'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Erro ao criar categoria',
            error: error.message
        });
    }
};

// Atualizar categoria
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const result = await query(
            'UPDATE categories SET name = $1, description = $2 WHERE id = $3 AND is_active = true RETURNING *',
            [name, description, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Categoria não encontrada'
            });
        }

        res.json({
            status: 'success',
            message: 'Categoria atualizada com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar categoria',
            error: error.message
        });
    }
};

// Deletar categoria (soft delete)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await query(
            'UPDATE categories SET is_active = false WHERE id = $1 AND is_active = true RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Categoria não encontrada'
            });
        }

        res.json({
            status: 'success',
            message: 'Categoria removida com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao remover categoria',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
