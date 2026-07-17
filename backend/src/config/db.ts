import { MongoClient, Db } from 'mongodb';
import { env } from './env';

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  try {
    client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    db = client.db(env.DATABASE_NAME);
    console.log(`Connected to MongoDB: ${env.DATABASE_NAME}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close();
  }
}
