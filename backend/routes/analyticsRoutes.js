import express from 'express';
import {
  getSummary,
  getMonthlyAnalytics,
  getCategoryAnalytics,
  getInsights,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyAnalytics);
router.get('/category', getCategoryAnalytics);
router.get('/insights', getInsights);

export default router;
