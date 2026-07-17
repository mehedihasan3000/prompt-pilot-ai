import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { aiRateLimit } from '../middlewares/rateLimit.middleware';

const router = Router();

router.post('/analyze', authMiddleware, aiRateLimit, aiController.analyze);
router.post('/optimize', authMiddleware, aiRateLimit, aiController.optimize);
router.post('/generate-variants', authMiddleware, aiRateLimit, aiController.generateVariants);
router.post('/score', authMiddleware, aiRateLimit, aiController.score);
router.post('/recommend', authMiddleware, aiRateLimit, aiController.recommend);
router.post('/chat', authMiddleware, aiRateLimit, aiController.chat);
router.post('/auto-tag', authMiddleware, aiRateLimit, aiController.autoTag);

export default router;
