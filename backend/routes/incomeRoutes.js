import express from 'express';
import {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All income routes are private

router.route('/').post(createIncome).get(getIncomes);
router.route('/:id').get(getIncomeById).put(updateIncome).delete(deleteIncome);

export default router;
