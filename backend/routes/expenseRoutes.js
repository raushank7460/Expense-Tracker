import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All expense routes are private

router.route('/').post(createExpense).get(getExpenses);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

export default router;
