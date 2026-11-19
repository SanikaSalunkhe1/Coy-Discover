import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Match } from '../models/Match.js';
import { User } from '../models/User.js';
import { getDemoUserId } from './feed.controller.js';

export async function getMatches(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const demoUserId = await getDemoUserId();
    const demoObjectId = new mongoose.Types.ObjectId(demoUserId);

    // Query Match collection where demo user is userOne or userTwo
    const matchDocs = await Match.find({
      $or: [{ userOne: demoObjectId }, { userTwo: demoObjectId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const matchesList = [];

    for (const doc of matchDocs) {
      // Identify the other user's ID
      const otherUserId = doc.userOne.equals(demoObjectId) ? doc.userTwo : doc.userOne;

      const otherUser = await User.findById(otherUserId).lean();
      if (otherUser) {
        matchesList.push({
          id: otherUser._id.toString(),
          name: otherUser.name,
          age: otherUser.age,
          photo: otherUser.photo,
          bio: otherUser.bio,
          city: otherUser.city,
          college: otherUser.college,
          interests: otherUser.interests,
          matchedAt: doc.createdAt.toISOString(),
        });
      }
    }

    res.json({
      matches: matchesList,
    });
  } catch (err) {
    next(err);
  }
}

