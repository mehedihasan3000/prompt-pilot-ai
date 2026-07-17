import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { collectionCollection, Collection } from '../models/collection.model';
import { promptCollection } from '../models/prompt.model';

export async function create(data: Partial<Collection>): Promise<Collection> {
  const db = getDb();
  const now = new Date();
  const doc = { ...data, createdAt: now, updatedAt: now } as Collection;
  const result = await db.collection(collectionCollection).insertOne(doc);
  return { ...doc, _id: result.insertedId } as unknown as Collection;
}

export async function findAll(userId: string) {
  const db = getDb();
  return db.collection(collectionCollection).find({ userId }).toArray();
}

export async function findById(id: string, userId: string): Promise<Collection | null> {
  const db = getDb();
  return db.collection(collectionCollection).findOne({ _id: new ObjectId(id), userId }) as Promise<Collection | null>;
}

export async function update(id: string, userId: string, data: Partial<Collection>): Promise<Collection | null> {
  const db = getDb();
  await db.collection(collectionCollection).updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...data, updatedAt: new Date() } }
  );
  return findById(id, userId);
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(collectionCollection).deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}

export async function addPrompt(collectionId: string, promptId: string, userId: string): Promise<void> {
  const db = getDb();
  await db.collection(promptCollection).updateOne(
    { _id: new ObjectId(promptId), userId },
    { $set: { collectionId } }
  );
}

export async function removePrompt(collectionId: string, promptId: string, userId: string): Promise<void> {
  const db = getDb();
  await db.collection(promptCollection).updateOne(
    { _id: new ObjectId(promptId), userId, collectionId },
    { $unset: { collectionId: '' } }
  );
}
