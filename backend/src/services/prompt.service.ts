import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { promptCollection, Prompt } from '../models/prompt.model';
import { mapDoc, mapDocs } from '../utils/mapDoc';

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
  return mapDoc<Prompt>({ ...doc, _id: result.insertedId })!;
}

export async function findAll(params: FindAllParams) {
  const db = getDb();
  const { userId, search, category, targetModel, sort = 'createdAt', order = 'desc', page: rawPage = 1, limit: rawLimit = 20 } = params;
  const page = Number(rawPage);
  const limit = Number(rawLimit);
  const query: any = { userId };
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (targetModel) query.targetModel = targetModel;
  const total = await db.collection(promptCollection).countDocuments(query);
  const docs = await db.collection(promptCollection)
    .find(query)
    .sort({ [sort]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  const prompts = mapDocs<Prompt>(docs);
  return { prompts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<Prompt | null> {
  const db = getDb();
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection(promptCollection).findOne({ _id: new ObjectId(id) });
  return mapDoc<Prompt>(doc);
}

export async function update(id: string, userId: string, data: Partial<Prompt>): Promise<Prompt | null> {
  const db = getDb();
  if (!ObjectId.isValid(id)) return null;
  await db.collection(promptCollection).updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...data, updatedAt: new Date() } }
  );
  return findById(id);
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  if (!ObjectId.isValid(id)) return false;
  const result = await db.collection(promptCollection).deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}

export async function toggleFavorite(id: string, userId: string): Promise<Prompt | null> {
  const db = getDb();
  if (!ObjectId.isValid(id)) return null;
  const doc = await db.collection(promptCollection).findOne({ _id: new ObjectId(id), userId });
  if (!doc) return null;
  const newFavorite = !doc.favorite;
  await db.collection(promptCollection).updateOne(
    { _id: new ObjectId(id) },
    { $set: { favorite: newFavorite, updatedAt: new Date() } }
  );
  return { ...mapDoc<Prompt>(doc)!, favorite: newFavorite };
}
