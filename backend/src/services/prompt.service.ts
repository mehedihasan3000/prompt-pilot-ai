import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { promptCollection, Prompt } from '../models/prompt.model';

interface FindAllParams {
  userId: string;
  search?: string;
  category?: string;
  targetModel?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function create(data: Partial<Prompt>): Promise<Prompt> {
  const db = getDb();
  const now = new Date();
  const doc = { ...data, createdAt: now, updatedAt: now } as Prompt;
  const result = await db.collection(promptCollection).insertOne(doc);
  return { ...doc, _id: result.insertedId } as unknown as Prompt;
}

export async function findAll(params: FindAllParams) {
  const db = getDb();
  const { userId, search, category, targetModel, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = params;
  const query: any = { userId };
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (targetModel) query.targetModel = targetModel;
  const total = await db.collection(promptCollection).countDocuments(query);
  const prompts = await db.collection(promptCollection)
    .find(query)
    .sort({ [sort]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return { prompts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<Prompt | null> {
  const db = getDb();
  return db.collection(promptCollection).findOne({ _id: new ObjectId(id) }) as Promise<Prompt | null>;
}

export async function update(id: string, userId: string, data: Partial<Prompt>): Promise<Prompt | null> {
  const db = getDb();
  await db.collection(promptCollection).updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...data, updatedAt: new Date() } }
  );
  return findById(id);
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(promptCollection).deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}

export async function toggleFavorite(id: string, userId: string): Promise<Prompt | null> {
  const db = getDb();
  const prompt = await db.collection(promptCollection).findOne({ _id: new ObjectId(id), userId });
  if (!prompt) return null;
  const newFavorite = !prompt.favorite;
  await db.collection(promptCollection).updateOne(
    { _id: new ObjectId(id) },
    { $set: { favorite: newFavorite, updatedAt: new Date() } }
  );
  return { ...prompt, favorite: newFavorite } as unknown as Prompt;
}
