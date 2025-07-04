const { query } = require('../database/connection');

// Listar todos os usuários (apenas admin)
const getAllUsers = async (req, res) => {
    try {
        const { limit = 10, offset = 0, is_active } = req.query;
        
        let queryText = `
            SELECT 
                id,
                name,
                email,
                phone,
                city,
                state,
                role,
                is_active,
                created_at
            FROM users
        `;
        
        const params = [];
        let paramIndex = 1;

        if (is_active !== undefined) {
            queryText += ` WHERE is_active = $${paramIndex}`;
            params.push(is_active === 'true');
            paramIndex++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
            message: 'Erro ao buscar usuários',
            error: error.message
        });
    }
};

// Buscar usuário por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(`
            SELECT 
                id,
                name,
                email,
                phone,
                address,
                city,
                state,
                zip_code,
                role,
                is_active,
                created_at
            FROM users 
            WHERE id = $1 AND is_active = true
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar usuário',
            error: error.message
        });
    }
};

// Criar novo usuário
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, city, state, zip_code, role = 'user' } = req.body;
        
        const result = await query(
            'INSERT INTO users (name, email, password, phone, address, city, state, zip_code, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, email, phone, city, state, role, created_at',
            [name, email, password, phone, address, city, state, zip_code, role]
        );
        
        res.status(201).json({
            status: 'success',
            message: 'Usuário criado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({
                status: 'error',
                message: 'Email já está em uso'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Erro ao criar usuário',
            error: error.message
        });
    }
};

// Atualizar usuário
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, city, state, zip_code } = req.body;
        
        const result = await query(
            'UPDATE users SET name = $1, email = $2, phone = $3, address = $4, city = $5, state = $6, zip_code = $7 WHERE id = $8 AND is_active = true RETURNING id, name, email, phone, city, state, role, updated_at',
            [name, email, phone, address, city, state, zip_code, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Usuário atualizado com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                status: 'error',
                message: 'Email já está em uso'
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar usuário',
            error: error.message
        });
    }
};

// Atualizar role do usuário (apenas admin)
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        const result = await query(
            'UPDATE users SET role = $1 WHERE id = $2 AND is_active = true RETURNING id, name, email, role, updated_at',
            [role, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Role do usuário atualizada com sucesso',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar role do usuário',
            error: error.message
        });
    }
};

// Deletar usuário (soft delete - apenas admin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await query(
            'UPDATE users SET is_active = false WHERE id = $1 AND is_active = true RETURNING id, name, email',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Usuário removido com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao remover usuário',
            error: error.message
        });
    }
};

// Buscar próprio perfil (usuário logado)
const getProfile = async (req, res) => {
    try {
        const { id } = req.user; // Vem do middleware de autenticação
        
        const result = await query(`
            SELECT 
                id,
                name,
                email,
                phone,
                address,
                city,
                state,
                zip_code,
                role,
                created_at
            FROM users 
            WHERE id = $1 AND is_active = true
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar perfil',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    getProfile
};
