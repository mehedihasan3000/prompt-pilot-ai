import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { templateCollection, Template } from '../models/template.model';
import { mapDoc, mapDocs } from '../utils/mapDoc';

interface FindAllParams {
  search?: string;
  category?: string;
  targetModel?: string;
  difficulty?: string;
  userId?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function create(data: Partial<Template>): Promise<Template> {
  const db = getDb();
  const now = new Date();
  const doc = { ...data, usageCount: 0, averageRating: 0, createdAt: now, updatedAt: now } as Template;
  const result = await db.collection(templateCollection).insertOne(doc);
  return mapDoc<Template>({ ...doc, _id: result.insertedId })!;
}

export async function findAll(params: FindAllParams) {
  const db = getDb();
  const { search, category, targetModel, difficulty, userId, sort = 'createdAt', order = 'desc', page: rawPage = 1, limit: rawLimit = 20 } = params;
  const page = Number(rawPage);
  const limit = Number(rawLimit);
  const query: any = {};
  if (userId) {
    query.userId = userId;
  } else {
    query.visibility = 'public';
  }
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (targetModel) query.targetModel = targetModel;
  if (difficulty) query.difficulty = difficulty;
  const total = await db.collection(templateCollection).countDocuments(query);
  const docs = await db.collection(templateCollection)
    .find(query)
    .sort({ [sort]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  const templates = mapDocs<Template>(docs);
  return { templates, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<Template | null> {
  const db = getDb();
  const doc = await db.collection(templateCollection).findOne({ _id: new ObjectId(id) });
  return mapDoc<Template>(doc);
}

export async function update(id: string, userId: string, data: Partial<Template>): Promise<Template | null> {
  const db = getDb();
  await db.collection(templateCollection).updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...data, updatedAt: new Date() } }
  );
  return findById(id);
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(templateCollection).deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}

export async function incrementUsage(id: string): Promise<void> {
  const db = getDb();
  await db.collection(templateCollection).updateOne(
    { _id: new ObjectId(id) },
    { $inc: { usageCount: 1 } }
  );
}
