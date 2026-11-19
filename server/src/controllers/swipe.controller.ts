import { Request, Response, NextFunction } from 'express';
import { processSwipe } from '../services/matching.service.js';
import { getDemoUserId } from './feed.controller.js';

export async function handleSwipe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { profileId, action } = req.body;
    const demoUserId = await getDemoUserId();

    const result = await processSwipe(demoUserId, profileId, action);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

