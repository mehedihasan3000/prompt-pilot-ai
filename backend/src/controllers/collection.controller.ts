import { Request, Response, NextFunction } from 'express';
import * as collectionService from '../services/collection.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await collectionService.create({ ...req.body, userId: req.userId! });
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collections = await collectionService.findAll(req.userId!);
    res.json({ success: true, data: collections });
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await collectionService.findById(req.params.id, req.userId!);
    if (!collection) {
      res.status(404).json({ success: false, error: 'Collection not found' });
      return;
    }
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await collectionService.update(req.params.id, req.userId!, req.body);
    if (!collection) {
      res.status(404).json({ success: false, error: 'Collection not found' });
      return;
    }
    res.json({ success: true, data: collection });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await collectionService.remove(req.params.id, req.userId!);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Collection not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function addPrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await collectionService.addPrompt(req.params.id, req.body.promptId, req.userId!);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

export async function removePrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await collectionService.removePrompt(req.params.id, req.params.promptId, req.userId!);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
