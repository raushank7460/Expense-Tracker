import express from 'express';
import { getTransactions, exportTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTransactions);
router.get('/export', exportTransactions);

export default router;
