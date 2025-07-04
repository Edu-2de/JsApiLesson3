const { query } = require('../database/connection');

// Middleware para simular autenticação (em produção, use JWT)
const authenticateUser = async (req, res, next) => {
    try {
        // Em produção, você extrairia o token do header Authorization
        const userId = req.headers['user-id']; // Simulação para testes
        
        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Token de autenticação necessário'
            });
        }

        // Buscar usuário no banco
        const result = await query(
            'SELECT id, name, email, role, is_active FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0 || !result.rows[0].is_active) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuário não encontrado ou inativo'
            });
        }

        // Adicionar dados do usuário à requisição
        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro na autenticação',
            error: error.message
        });
    }
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuário não autenticado'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Acesso negado. Apenas administradores podem realizar esta ação'
        });
    }

    next();
};

// Middleware para verificar se é o próprio usuário ou admin
const requireOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuário não autenticado'
        });
    }

    const { id } = req.params;
    
    if (req.user.role === 'admin' || req.user.id === parseInt(id)) {
        next();
    } else {
        return res.status(403).json({
            status: 'error',
            message: 'Acesso negado. Você só pode acessar seus próprios dados'
        });
    }
};

// Middleware para verificar se pode modificar produtos
const canModifyProducts = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Usuário não autenticado'
        });
    }

    // Admin pode modificar qualquer produto
    if (req.user.role === 'admin') {
        return next();
    }

    // Usuário normal só pode modificar seus próprios produtos
    if (req.body.user_id && req.body.user_id !== req.user.id) {
        return res.status(403).json({
            status: 'error',
            message: 'Você só pode modificar seus próprios produtos'
        });
    }

    next();
};

module.exports = {
    authenticateUser,
    requireAdmin,
    requireOwnerOrAdmin,
    canModifyProducts
};
