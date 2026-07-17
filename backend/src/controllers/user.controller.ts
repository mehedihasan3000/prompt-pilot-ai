import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getMe(req.userId!);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.updateProfile(req.userId!, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await authService.deleteAccount(req.userId!);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
