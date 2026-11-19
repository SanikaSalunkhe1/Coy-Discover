import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Swipe } from '../models/Swipe.js';
import { Match } from '../models/Match.js';
import { DEMO_USER_PROFILE, MOCK_PROFILES } from './mockProfilesData.js';

dotenv.config();

export async function seedDatabase(): Promise<{ demoUserId: string; profileCount: number; incomingLikesCount: number }> {
  await connectDB();

  console.log('[Seed] Seeding database idempotently...');

  // 1. Upsert Demo User
  const demoUser = await User.findOneAndUpdate(
    { name: DEMO_USER_PROFILE.name },
    {
      $set: {
        name: DEMO_USER_PROFILE.name,
        age: DEMO_USER_PROFILE.age,
        photo: DEMO_USER_PROFILE.photo,
        bio: DEMO_USER_PROFILE.bio,
        city: DEMO_USER_PROFILE.city,
        college: DEMO_USER_PROFILE.college,
        interests: DEMO_USER_PROFILE.interests,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const demoUserId = demoUser._id.toString();
  console.log(`[Seed] Demo User ready: ${demoUser.name} (${demoUserId})`);

  // 2. Upsert all 35 mock profiles
  let seededProfilesCount = 0;
  const mockUserIds: { [name: string]: mongoose.Types.ObjectId } = {};

  for (const mock of MOCK_PROFILES) {
    const user = await User.findOneAndUpdate(
      { name: mock.name },
      {
        $set: {
          name: mock.name,
          age: mock.age,
          photo: mock.photo,
          bio: mock.bio,
          city: mock.city,
          college: mock.college,
          interests: mock.interests,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    mockUserIds[mock.name] = user._id;
    seededProfilesCount++;
  }

  console.log(`[Seed] Successfully verified/seeded ${seededProfilesCount} mock profiles.`);

  // 3. Seed incoming likes from selected mock profiles to the demo user
  // (Ensuring demo user has NOT swiped on them yet, so they appear in Discover feed)
  let incomingLikesCount = 0;

  for (const mock of MOCK_PROFILES) {
    if (mock.seedsIncomingLike) {
      const fromUserId = mockUserIds[mock.name];
      // Upsert incoming swipe record: from mock profile -> to demo user with action 'like'
      await Swipe.findOneAndUpdate(
        { fromUser: fromUserId, toUser: demoUser._id },
        {
          $set: {
            fromUser: fromUserId,
            toUser: demoUser._id,
            action: 'like',
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      incomingLikesCount++;
    }
  }

  console.log(`[Seed] Successfully seeded ${incomingLikesCount} incoming likes toward demo user.`);
  console.log('[Seed] Database seed completed successfully!');

  return {
    demoUserId,
    profileCount: seededProfilesCount + 1,
    incomingLikesCount,
  };
}

// Run standalone if invoked directly
if (process.argv[1]?.includes('seedProfiles')) {
  seedDatabase()
    .then(async (result) => {
      console.log(`[Seed] Finished! DEMO_USER_ID=${result.demoUserId}`);
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed] Error during seeding:', err);
      await disconnectDB();
      process.exit(1);
    });
}

