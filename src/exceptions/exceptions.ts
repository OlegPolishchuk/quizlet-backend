import type { Response } from 'express';

export const unauthorizedException = (res: Response) => {
  return res.status(401).json({ error: 'Not authenticated' });
};
