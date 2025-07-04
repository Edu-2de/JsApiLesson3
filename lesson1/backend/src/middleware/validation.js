// Middleware para validar dados de categoria
const validateCategory = (req, res, next) => {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Nome da categoria é obrigatório'
        });
    }
    
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
            status: 'error',
            message: 'Nome da categoria deve ter entre 2 e 100 caracteres'
        });
    }
    
    if (description && description.length > 500) {
        return res.status(400).json({
            status: 'error',
            message: 'Descrição deve ter no máximo 500 caracteres'
        });
    }
    
    next();
};

// Middleware para validar dados de produto
const validateProduct = (req, res, next) => {
    const { name, description, price, stock_quantity, category_id, user_id } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Nome do produto é obrigatório'
        });
    }
    
    if (name.length < 2 || name.length > 200) {
        return res.status(400).json({
            status: 'error',
            message: 'Nome do produto deve ter entre 2 e 200 caracteres'
        });
    }
    
    if (!price || price <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Preço deve ser maior que zero'
        });
    }
    
    if (stock_quantity < 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Quantidade em estoque não pode ser negativa'
        });
    }
    
    if (!category_id || !Number.isInteger(Number(category_id))) {
        return res.status(400).json({
            status: 'error',
            message: 'ID da categoria é obrigatório e deve ser um número'
        });
    }
    
    if (!user_id || !Number.isInteger(Number(user_id))) {
        return res.status(400).json({
            status: 'error',
            message: 'ID do usuário é obrigatório e deve ser um número'
        });
    }
    
    next();
};

// Middleware para validar dados de usuário
const validateUser = (req, res, next) => {
    const { name, email, password, phone, role } = req.body;
    
    if (!name || name.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Nome é obrigatório'
        });
    }
    
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
            status: 'error',
            message: 'Nome deve ter entre 2 e 100 caracteres'
        });
    }
    
    if (!email || email.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Email é obrigatório'
        });
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Email deve ter um formato válido'
        });
    }
    
    if (password && password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Senha deve ter pelo menos 6 caracteres'
        });
    }
    
    if (phone && phone.length < 10) {
        return res.status(400).json({
            status: 'error',
            message: 'Telefone deve ter pelo menos 10 caracteres'
        });
    }
    
    if (role && !['user', 'admin'].includes(role)) {
        return res.status(400).json({
            status: 'error',
            message: 'Role deve ser "user" ou "admin"'
        });
    }
    
    next();
};

// Middleware para validar atualização de role
const validateRole = (req, res, next) => {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({
            status: 'error',
            message: 'Role deve ser "user" ou "admin"'
        });
    }
    
    next();
};

// Middleware para validar ID como parâmetro
const validateId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || !Number.isInteger(Number(id))) {
        return res.status(400).json({
            status: 'error',
            message: 'ID deve ser um número válido'
        });
    }
    
    next();
};

// Middleware para validar query parameters de paginação
const validatePagination = (req, res, next) => {
    const { limit, offset } = req.query;
    
    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        return res.status(400).json({
            status: 'error',
            message: 'Limit deve ser um número entre 1 e 100'
        });
    }
    
    if (offset && (!Number.isInteger(Number(offset)) || Number(offset) < 0)) {
        return res.status(400).json({
            status: 'error',
            message: 'Offset deve ser um número maior ou igual a zero'
        });
    }
    
    next();
};

module.exports = {
    validateCategory,
    validateProduct,
    validateId,
    validatePagination,
    validateUser,
    validateRole
};
