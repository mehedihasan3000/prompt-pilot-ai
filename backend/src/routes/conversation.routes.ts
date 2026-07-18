import { Router } from 'express';
import * as conversationController from '../controllers/conversation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, conversationController.create);
router.get('/', authMiddleware, conversationController.findAll);
router.get('/:id', authMiddleware, conversationController.findById);
router.delete('/:id', authMiddleware, conversationController.remove);
router.get('/:id/messages', authMiddleware, conversationController.getMessages);
router.post('/:id/messages', authMiddleware, conversationController.addMessage);

export default router;
