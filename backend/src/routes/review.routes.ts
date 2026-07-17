import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator';

const router = Router();

router.post('/templates/:id/reviews', authMiddleware, validate(createReviewSchema), reviewController.create);
router.get('/templates/:id/reviews', reviewController.findAll);
router.patch('/reviews/:id', authMiddleware, validate(updateReviewSchema), reviewController.update);
router.delete('/reviews/:id', authMiddleware, reviewController.remove);

export default router;
