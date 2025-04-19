import express from 'express';
import { getAllTransactions, markTransactionPaid } from '../controllers/transactionController.js';
import verifyUser from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', verifyUser, admin, getAllTransactions);
router.put('/mark-paid', verifyUser, admin, markTransactionPaid);

export default router;