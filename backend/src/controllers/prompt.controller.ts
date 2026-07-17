import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/prompt.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prompt = await promptService.create({ ...req.body, userId: req.userId! });
    res.status(201).json({ success: true, data: prompt });
  } catch (error) {
    next(error);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await promptService.findAll({ ...req.query, userId: req.userId! } as any);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prompt = await promptService.findById(req.params.id);
    if (!prompt) {
      res.status(404).json({ success: false, error: 'Prompt not found' });
      return;
    }
    res.json({ success: true, data: prompt });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prompt = await promptService.update(req.params.id, req.userId!, req.body);
    if (!prompt) {
      res.status(404).json({ success: false, error: 'Prompt not found' });
      return;
    }
    res.json({ success: true, data: prompt });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await promptService.remove(req.params.id, req.userId!);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Prompt not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prompt = await promptService.toggleFavorite(req.params.id, req.userId!);
    if (!prompt) {
      res.status(404).json({ success: false, error: 'Prompt not found' });
      return;
    }
    res.json({ success: true, data: prompt });
  } catch (error) {
    next(error);
  }
}
