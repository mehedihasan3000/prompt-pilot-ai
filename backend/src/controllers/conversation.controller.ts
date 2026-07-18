import { Request, Response, NextFunction } from 'express';
import * as conversationService from '../services/conversation.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversation = await conversationService.create(req.userId!, req.body.title);
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversations = await conversationService.findAll(req.userId!);
    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversation = await conversationService.findById(req.params.id, req.userId!);
    if (!conversation) {
      res.status(404).json({ success: false, error: 'Conversation not found' });
      return;
    }
    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await conversationService.remove(req.params.id, req.userId!);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Conversation not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const messages = await conversationService.getMessages(req.params.id, req.userId!);
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
}

export async function addMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await conversationService.addMessage(req.params.id, req.body.role, req.body.content);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}
