import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';

export async function getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.getSummary(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getPromptsOverTime(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.getPromptsOverTime(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.getCategoryUsage(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getModelUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.getModelUsage(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getScoreTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.getScoreTrends(req.userId!);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
