import { Router } from 'express';
import * as collectionController from '../controllers/collection.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCollectionSchema, updateCollectionSchema } from '../validators/collection.validator';

const router = Router();

router.post('/', authMiddleware, validate(createCollectionSchema), collectionController.create);
router.get('/', authMiddleware, collectionController.findAll);
router.get('/:id', authMiddleware, collectionController.findById);
router.patch('/:id', authMiddleware, validate(updateCollectionSchema), collectionController.update);
router.delete('/:id', authMiddleware, collectionController.remove);
router.post('/:id/prompts', authMiddleware, collectionController.addPrompt);
router.delete('/:id/prompts/:promptId', authMiddleware, collectionController.removePrompt);

export default router;
