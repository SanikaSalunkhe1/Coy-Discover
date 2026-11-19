import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Swipe, SwipeAction } from '../models/Swipe.js';
import { Match, getPairKey } from '../models/Match.js';

export interface SwipeResult {
  success: boolean;
  isMatch: boolean;
  match?: {
    id: string;
  };
}

export async function processSwipe(
  fromUserId: string,
  toUserId: string,
  action: SwipeAction
): Promise<SwipeResult> {
  if (fromUserId === toUserId) {
    const error: any = new Error('Self-swiping is not permitted');
    error.status = 400;
    throw error;
  }

  // Validate target user exists
  const targetUser = await User.findById(toUserId).lean();
  if (!targetUser) {
    const error: any = new Error('Target profile does not exist or is unavailable');
    error.status = 404;
    throw error;
  }

  // Check if a swipe already exists from this user to target
  const existingSwipe = await Swipe.findOne({
    fromUser: new mongoose.Types.ObjectId(fromUserId),
    toUser: new mongoose.Types.ObjectId(toUserId),
  });

  if (existingSwipe) {
    // If already swiped with same or different action, handle idempotently
    if (existingSwipe.action === 'like' && action === 'like') {
      const pairKey = getPairKey(fromUserId, toUserId);
      const existingMatch = await Match.findOne({ pairKey });
      if (existingMatch) {
        return {
          success: true,
          isMatch: true,
          match: { id: existingMatch._id.toString() },
        };
      }
    }
    // Return idempotent success without creating duplicates
    return {
      success: true,
      isMatch: false,
    };
  }

  // Persist the swipe record
  try {
    await Swipe.create({
      fromUser: new mongoose.Types.ObjectId(fromUserId),
      toUser: new mongoose.Types.ObjectId(toUserId),
      action,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key error - handled idempotently
      return { success: true, isMatch: false };
    }
    throw err;
  }

  // If action is pass, do not check or create a match
  if (action === 'pass') {
    return {
      success: true,
      isMatch: false,
    };
  }

  // For action = 'like', check if reverse swipe exists with action 'like'
  const reverseLike = await Swipe.findOne({
    fromUser: new mongoose.Types.ObjectId(toUserId),
    toUser: new mongoose.Types.ObjectId(fromUserId),
    action: 'like',
  });

  if (reverseLike) {
    const pairKey = getPairKey(fromUserId, toUserId);
    const sortedIds = [fromUserId, toUserId].sort();

    // Upsert canonical match record
    const match = await Match.findOneAndUpdate(
      { pairKey },
      {
        $setOnInsert: {
          userOne: new mongoose.Types.ObjectId(sortedIds[0]),
          userTwo: new mongoose.Types.ObjectId(sortedIds[1]),
          pairKey,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      isMatch: true,
      match: {
        id: match._id.toString(),
      },
    };
  }

  return {
    success: true,
    isMatch: false,
  };
}

