import { Request, Response, NextFunction } from 'express';
import { getFeedForUser } from '../services/feed.service.js';
import { User } from '../models/User.js';

let cachedDemoUserId: string | null = null;

export async function getDemoUserId(): Promise<string> {
  const envId = process.env.DEMO_USER_ID;
  if (envId && envId.length === 24 && /^[0-9a-fA-F]{24}$/.test(envId)) {
    return envId;
  }
  if (cachedDemoUserId) {
    return cachedDemoUserId;
  }
  // Fallback to looking up user named "Sanika Salunkhe" or first user in DB
  const demoUser = await User.findOne({
    $or: [{ name: 'Sanika Salunkhe' }, { isDemoUser: true } as any],
  }).lean();

  if (demoUser) {
    cachedDemoUserId = demoUser._id.toString();
    return cachedDemoUserId;
  }

  const anyUser = await User.findOne().sort({ createdAt: 1 }).lean();
  if (anyUser) {
    cachedDemoUserId = anyUser._id.toString();
    return cachedDemoUserId;
  }

  throw new Error('No users found in database. Please run npm run seed first.');
}

export function setCachedDemoUserId(id: string): void {
  cachedDemoUserId = id;
}

export async function getFeed(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const demoUserId = await getDemoUserId();
    const profiles = await getFeedForUser(demoUserId);

    res.json({
      profiles,
    });
  } catch (err) {
    next(err);
  }
}

