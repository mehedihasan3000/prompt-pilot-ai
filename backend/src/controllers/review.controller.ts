import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await reviewService.create(req.params.id, req.userId!, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await reviewService.findAllByTemplate(req.params.id);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await reviewService.update(req.params.id, req.userId!, req.body);
    if (!review) {
      res.status(404).json({ success: false, error: 'Review not found' });
      return;
    }
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await reviewService.remove(req.params.id, req.userId!);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Review not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
