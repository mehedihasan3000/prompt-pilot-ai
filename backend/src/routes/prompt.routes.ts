import { Router } from 'express';
import * as promptController from '../controllers/prompt.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPromptSchema, updatePromptSchema } from '../validators/prompt.validator';

const router = Router();

router.post('/', authMiddleware, validate(createPromptSchema), promptController.create);
router.get('/', authMiddleware, promptController.findAll);
router.get('/:id', authMiddleware, promptController.findById);
router.patch('/:id', authMiddleware, validate(updatePromptSchema), promptController.update);
router.delete('/:id', authMiddleware, promptController.remove);
router.patch('/:id/favorite', authMiddleware, promptController.toggleFavorite);

export default router;
