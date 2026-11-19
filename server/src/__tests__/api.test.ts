import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Swipe } from '../models/Swipe.js';
import { Match, getPairKey } from '../models/Match.js';
import { setCachedDemoUserId } from '../controllers/feed.controller.js';

describe('Coy Discover API and Privacy Verification Tests', () => {
  const app = createApp();
  let demoUserId: string;
  let nonSwipedProfileId: string;
  let incomingLikerProfileId: string;
  let ordinaryProfileId: string;

  beforeAll(async () => {
    await connectDB();

    // Clean test collections
    await User.deleteMany({});
    await Swipe.deleteMany({});
    await Match.deleteMany({});

    // Create demo user
    const demoUser = await User.create({
      name: 'Sanika Salunkhe (Demo)',
      age: 21,
      photo: '/avatars/avatar-01.svg',
      bio: 'Demo user bio',
      city: 'Pune',
      college: 'COEP',
      interests: ['Coding', 'Music', 'Design', 'Reading'],
    });
    demoUserId = demoUser._id.toString();
    process.env.DEMO_USER_ID = demoUserId;
    setCachedDemoUserId(demoUserId);

    // Profile 1: Incoming liker (has liked demo user)
    const incomingLiker = await User.create({
      name: 'Aarav Mehta',
      age: 22,
      photo: '/avatars/avatar-02.svg',
      bio: 'Likes coding and music',
      city: 'Mumbai',
      college: 'IIT Bombay',
      interests: ['Coding', 'Music', 'Gaming'],
    });
    incomingLikerProfileId = incomingLiker._id.toString();

    // Seed incoming like: incomingLiker -> demoUser
    await Swipe.create({
      fromUser: incomingLiker._id,
      toUser: demoUser._id,
      action: 'like',
    });

    // Profile 2: Ordinary profile (has NOT liked demo user)
    const ordinary = await User.create({
      name: 'Diya Sengupta',
      age: 20,
      photo: '/avatars/avatar-03.svg',
      bio: 'Literature and art',
      city: 'Kolkata',
      college: 'Jadavpur University',
      interests: ['Reading', 'Writing', 'Art'],
    });
    ordinaryProfileId = ordinary._id.toString();

    // Profile 3: Another profile for pass testing
    const nonSwiped = await User.create({
      name: 'Rohan Joshi',
      age: 23,
      photo: '/avatars/avatar-04.svg',
      bio: 'Startups and coffee',
      city: 'Pune',
      college: 'PICT',
      interests: ['Coding', 'Startups', 'Coffee'],
    });
    nonSwipedProfileId = nonSwiped._id.toString();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // TEST 1: GET /feed returns at least some profiles and excludes the demo user
  it('1. GET /feed returns eligible profiles and excludes the demo user', async () => {
    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body.profiles).toBeDefined();
    expect(Array.isArray(res.body.profiles)).toBe(true);
    expect(res.body.profiles.length).toBeGreaterThan(0);

    const ids = res.body.profiles.map((p: any) => p.id);
    expect(ids).not.toContain(demoUserId);
  });

  // TEST 2: GET /feed excludes every profile already swiped by the demo user
  it('2. GET /feed excludes every profile already swiped by the demo user', async () => {
    // Demo user swipes on nonSwipedProfileId
    await request(app)
      .post('/swipe')
      .send({ profileId: nonSwipedProfileId, action: 'pass' });

    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    const ids = res.body.profiles.map((p: any) => p.id);
    expect(ids).not.toContain(nonSwipedProfileId);
  });

  // TEST 3: GET /feed never returns incoming-Like fields
  it('3. GET /feed never returns incoming-Like fields or private matching data', async () => {
    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);

    for (const profile of res.body.profiles) {
      expect(profile.likedYou).toBeUndefined();
      expect(profile.incomingLike).toBeUndefined();
      expect(profile.incomingLikesCount).toBeUndefined();
      expect(profile.secretAdmirer).toBeUndefined();
      expect(profile.reverseSwipeExists).toBeUndefined();
      expect(profile.hasLikedDemo).toBeUndefined();
    }
  });

  // TEST 4: POST /swipe with 'pass' persists a Pass and never creates a match
  it("4. POST /swipe with 'pass' persists a Pass and never creates a match", async () => {
    const newTarget = await User.create({
      name: 'Pass Target User',
      age: 22,
      photo: '/avatars/avatar-05.svg',
      bio: 'Test pass target',
      city: 'Delhi',
      college: 'DTU',
      interests: ['Coding'],
    });

    const res = await request(app)
      .post('/swipe')
      .send({ profileId: newTarget._id.toString(), action: 'pass' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isMatch).toBe(false);
    expect(res.body.match).toBeUndefined();

    // Verify in database
    const swipeInDb = await Swipe.findOne({
      fromUser: new mongoose.Types.ObjectId(demoUserId),
      toUser: newTarget._id,
    });
    expect(swipeInDb).not.toBeNull();
    expect(swipeInDb?.action).toBe('pass');

    const matchInDb = await Match.findOne({
      pairKey: getPairKey(demoUserId, newTarget._id.toString()),
    });
    expect(matchInDb).toBeNull();
  });

  // TEST 5: POST /swipe with 'like' and no reverse Like returns isMatch false
  it("5. POST /swipe with 'like' and no reverse Like returns isMatch false", async () => {
    const res = await request(app)
      .post('/swipe')
      .send({ profileId: ordinaryProfileId, action: 'like' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isMatch).toBe(false);
    expect(res.body.match).toBeUndefined();

    // Verify swipe is saved
    const swipe = await Swipe.findOne({
      fromUser: new mongoose.Types.ObjectId(demoUserId),
      toUser: new mongoose.Types.ObjectId(ordinaryProfileId),
    });
    expect(swipe?.action).toBe('like');
  });

  // TEST 6: POST /swipe with 'like' and an existing reverse Like creates exactly one Match
  it("6. POST /swipe with 'like' and an existing reverse Like creates exactly one Match", async () => {
    const res = await request(app)
      .post('/swipe')
      .send({ profileId: incomingLikerProfileId, action: 'like' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isMatch).toBe(true);
    expect(res.body.match?.id).toBeDefined();

    // Verify Match record exists in database
    const pairKey = getPairKey(demoUserId, incomingLikerProfileId);
    const matchesCount = await Match.countDocuments({ pairKey });
    expect(matchesCount).toBe(1);
  });

  // TEST 7: GET /matches returns mutual matches only
  it('7. GET /matches returns mutual matches only and never one-sided likes', async () => {
    const res = await request(app).get('/matches');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.matches)).toBe(true);

    const matchIds = res.body.matches.map((m: any) => m.id);
    // incomingLikerProfileId had mutual like
    expect(matchIds).toContain(incomingLikerProfileId);
    // ordinaryProfileId was one-sided like, should NOT be in matches
    expect(matchIds).not.toContain(ordinaryProfileId);
    // Demo user should NOT be in their own matches
    expect(matchIds).not.toContain(demoUserId);
  });

  // TEST 8: Duplicate swipe requests do not create duplicate records
  it('8. Duplicate swipe requests do not create duplicate records', async () => {
    const initialSwipeCount = await Swipe.countDocuments({
      fromUser: new mongoose.Types.ObjectId(demoUserId),
      toUser: new mongoose.Types.ObjectId(incomingLikerProfileId),
    });

    const res = await request(app)
      .post('/swipe')
      .send({ profileId: incomingLikerProfileId, action: 'like' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const finalSwipeCount = await Swipe.countDocuments({
      fromUser: new mongoose.Types.ObjectId(demoUserId),
      toUser: new mongoose.Types.ObjectId(incomingLikerProfileId),
    });
    expect(finalSwipeCount).toBe(initialSwipeCount);
  });

  // TEST 9: Invalid action returns 400 and changes no data
  it('9. Invalid action returns 400 and changes no data', async () => {
    const initialSwipeCount = await Swipe.countDocuments();

    const res = await request(app)
      .post('/swipe')
      .send({ profileId: ordinaryProfileId, action: 'maybe' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

    const finalSwipeCount = await Swipe.countDocuments();
    expect(finalSwipeCount).toBe(initialSwipeCount);
  });

  // TEST 10: Refresh/restart persistence works
  it('10. Refresh/restart persistence works: swipes and matches remain in MongoDB', async () => {
    // Read directly from MongoDB models to confirm persistence
    const swipedTargets = await Swipe.find({
      fromUser: new mongoose.Types.ObjectId(demoUserId),
    }).distinct('toUser');

    expect(swipedTargets.length).toBeGreaterThanOrEqual(3);

    const matches = await Match.find({
      $or: [
        { userOne: new mongoose.Types.ObjectId(demoUserId) },
        { userTwo: new mongoose.Types.ObjectId(demoUserId) },
      ],
    });
    expect(matches.length).toBe(1);
  });
});

