import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // TODO: Replace with Better Auth v1 server API session validation
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  req.userId = userId;
  next();
}
