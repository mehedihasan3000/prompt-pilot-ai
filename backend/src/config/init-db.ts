import { getDb } from './db';

export async function initializeDatabase(): Promise<void> {
  const db = getDb();
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  // Required collections
  const requiredCollections = ['users', 'prompts', 'templates', 'collections', 'conversations', 'messages', 'recommendations', 'reviews', 'analytics'];

  for (const name of requiredCollections) {
    if (!collectionNames.includes(name)) {
      await db.createCollection(name);
      console.log(`Created collection: ${name}`);
    }
  }

  // Create indexes for performance
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('prompts').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('prompts').createIndex({ userId: 1, category: 1 });
  await db.collection('prompts').createIndex({ userId: 1, favorite: 1 });
  await db.collection('prompts').createIndex({ title: 'text', originalPrompt: 'text' });
  await db.collection('templates').createIndex({ visibility: 1, createdAt: -1 });
  await db.collection('templates').createIndex({ category: 1 });
  await db.collection('templates').createIndex({ targetModel: 1 });
  await db.collection('templates').createIndex({ title: 'text', shortDescription: 'text' });
  await db.collection('collections').createIndex({ userId: 1, name: 1 });
  await db.collection('conversations').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('messages').createIndex({ conversationId: 1, createdAt: 1 });
  await db.collection('reviews').createIndex({ templateId: 1, createdAt: -1 });
  await db.collection('reviews').createIndex({ templateId: 1, userId: 1 }, { unique: true });
  await db.collection('analytics').createIndex({ userId: 1, createdAt: -1 });

  console.log('Database indexes created');
}
