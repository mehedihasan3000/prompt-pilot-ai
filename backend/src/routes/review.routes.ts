import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateReviewSchema } from '../validators/review.validator';

const router = Router();

router.patch('/:id', authMiddleware, validate(updateReviewSchema), reviewController.update);
router.delete('/:id', authMiddleware, reviewController.remove);

export default router;
