import mongoose from 'mongoose';
import { User, IUser } from '../models/User.js';
import { Swipe } from '../models/Swipe.js';

export interface FeedProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string;
  interests: string[];
  sharedInterests: string[];
  similarityScore?: number;
}

/**
 * Computes Jaccard Similarity between two sets of interests:
 * J(A, B) = |A ∩ B| / |A ∪ B| * 100
 */
export function calculateJaccardSimilarity(
  interestsA: string[],
  interestsB: string[]
): { score: number; sharedInterests: string[] } {
  const setA = new Set(interestsA.map((i) => i.toLowerCase().trim()));
  const setB = new Set(interestsB.map((i) => i.toLowerCase().trim()));

  const sharedInterests = interestsA.filter((i) =>
    setB.has(i.toLowerCase().trim())
  );

  const union = new Set([...setA, ...setB]);
  if (union.size === 0) {
    return { score: 0, sharedInterests: [] };
  }

  const score = Math.round((sharedInterests.length / union.size) * 100);
  return { score, sharedInterests };
}

export async function getFeedForUser(demoUserId: string): Promise<FeedProfile[]> {
  const demoObjectId = new mongoose.Types.ObjectId(demoUserId);

  // 1. Fetch demo user to get reference interests
  const demoUser = await User.findById(demoObjectId).lean();
  const demoInterests = demoUser?.interests || [];

  // 2. Fetch all user IDs already swiped by demo user (both like and pass)
  const swipedTargetIds = await Swipe.find({ fromUser: demoObjectId })
    .distinct('toUser')
    .exec();

  const excludedIds = [demoObjectId, ...swipedTargetIds];

  // 3. Query all eligible profiles not swiped yet and not the demo user
  const eligibleUsers = await User.find({
    _id: { $nin: excludedIds },
  }).lean();

  // 4. Calculate Jaccard similarity and shared interests for each profile
  const rankedProfiles = eligibleUsers.map((user: any) => {
    const { score, sharedInterests } = calculateJaccardSimilarity(
      demoInterests,
      user.interests || []
    );

    return {
      id: user._id.toString(),
      name: user.name,
      age: user.age,
      photo: user.photo,
      bio: user.bio,
      city: user.city,
      college: user.college,
      interests: user.interests,
      sharedInterests,
      similarityScore: score,
    };
  });

  // 5. Deterministic ranking:
  // Sort primarily by Jaccard score descending, and secondarily by ID ascending
  rankedProfiles.sort((a, b) => {
    if (b.similarityScore !== a.similarityScore) {
      return (b.similarityScore || 0) - (a.similarityScore || 0);
    }
    return a.id.localeCompare(b.id);
  });

  // 6. Return only public profile fields; never expose private matching signals
  return rankedProfiles.map(({ similarityScore, ...profile }) => profile);
}

