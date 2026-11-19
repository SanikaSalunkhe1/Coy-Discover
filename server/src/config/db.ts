import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

let mongoMemoryServer: any = null;

const SYSTEM_MONGOD_PATHS = [
  'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
];

export async function connectDB(customUri?: string): Promise<string> {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coy_discover';

  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.host;
  }

  try {
    // Attempt connecting to the configured URI with a short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to external MongoDB at ${uri}`);
    return uri;
  } catch (err: any) {
    console.warn(`[Database] Could not connect to external MongoDB (${err.message}). Starting embedded MongoDB...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');

      // Check if system mongod binary exists to skip downloading
      let systemBinaryPath: string | undefined = undefined;
      for (const p of SYSTEM_MONGOD_PATHS) {
        if (fs.existsSync(p)) {
          systemBinaryPath = p;
          break;
        }
      }

      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          port: 27018, // Use alternate port to avoid collision
          dbName: 'coy_discover',
        },
        binary: systemBinaryPath
          ? {
              systemBinary: systemBinaryPath,
            }
          : undefined,
      });

      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to embedded MongoDB at ${memoryUri}`);
      return memoryUri;
    } catch (fallbackErr: any) {
      console.error('[Database] Failed to initialize embedded MongoDB:', fallbackErr);
      throw fallbackErr;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
  console.log('[Database] Disconnected from MongoDB');
}

export async function clearDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}
