import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/summary', authMiddleware, analyticsController.getSummary);
router.get('/prompts-over-time', authMiddleware, analyticsController.getPromptsOverTime);
router.get('/category-usage', authMiddleware, analyticsController.getCategoryUsage);
router.get('/model-usage', authMiddleware, analyticsController.getModelUsage);
router.get('/score-trends', authMiddleware, analyticsController.getScoreTrends);
router.get('/recent-activity', authMiddleware, analyticsController.getRecentActivity);

export default router;
