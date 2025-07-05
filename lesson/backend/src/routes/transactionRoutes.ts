import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { PurchaseController } from '../controllers/purchaseController';
import { validateId } from '../middleware/validation';

const router = Router();

// Transações
router.post('/add-balance', TransactionController.addBalance);
router.get('/balance/:user_id', validateId, TransactionController.getUserBalance);
router.get('/transactions/:user_id', validateId, TransactionController.getUserTransactions);

// Compras
router.post('/purchase', PurchaseController.makePurchase);
router.get('/orders/:user_id', validateId, PurchaseController.getUserOrders);

export default router;