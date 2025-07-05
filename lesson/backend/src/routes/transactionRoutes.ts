import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { PurchaseController } from '../controllers/purchaseController';
import { validateId } from '../middleware/validation';
import { authenticateToken, requireAdmin, requireOwnerOrAdmin } from '../middleware/auth';

const router = Router();

// Transações
router.post('/add-balance', authenticateToken, requireAdmin, TransactionController.addBalance);
router.get('/balance/:user_id', authenticateToken, validateId, requireOwnerOrAdmin, TransactionController.getUserBalance);
router.get('/transactions/:user_id', authenticateToken, validateId, requireOwnerOrAdmin, TransactionController.getUserTransactions);

// Compras (apenas usuários autenticados)
router.post('/purchase', authenticateToken, PurchaseController.makePurchase);
router.get('/orders/:user_id', authenticateToken, validateId, requireOwnerOrAdmin, PurchaseController.getUserOrders);

export default router;