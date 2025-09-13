import { Request, Response, NextFunction } from 'express';

export function flaky(req: Request, res: Response, next: NextFunction) {
  // Randomly fail requests with a 20% chance
  if (Math.random() < 0.2) {
    return res.status(500).json({ error: 'Random failure' });
  }

  // Add random delay up to 2 second
  const delay = Math.random() * 2000;
  setTimeout(next, delay);
}
