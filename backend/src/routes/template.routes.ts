import { Router } from 'express';
import * as templateController from '../controllers/template.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTemplateSchema, updateTemplateSchema } from '../validators/template.validator';

const router = Router();

router.post('/', authMiddleware, validate(createTemplateSchema), templateController.create);
router.get('/', templateController.findAll);
router.get('/:id', templateController.findById);
router.patch('/:id', authMiddleware, validate(updateTemplateSchema), templateController.update);
router.delete('/:id', authMiddleware, templateController.remove);
router.post('/:id/use', templateController.incrementUsage);

export default router;
