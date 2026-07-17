import { Request, Response, NextFunction } from 'express';
import * as templateService from '../services/template.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const template = await templateService.create({ ...req.body, userId: req.userId! });
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await templateService.findAll(req.query as any);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const template = await templateService.findById(req.params.id);
    if (!template) {
      res.status(404).json({ success: false, error: 'Template not found' });
      return;
    }
    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const template = await templateService.update(req.params.id, req.userId!, req.body);
    if (!template) {
      res.status(404).json({ success: false, error: 'Template not found' });
      return;
    }
    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await templateService.remove(req.params.id, req.userId!);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Template not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function incrementUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await templateService.incrementUsage(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
