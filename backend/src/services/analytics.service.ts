import { getDb } from '../config/db';
import { promptCollection } from '../models/prompt.model';
import { analyticsCollection } from '../models/analytics.model';

export async function getSummary(userId: string) {
  const db = getDb();
  const totalPrompts = await db.collection(promptCollection).countDocuments({ userId });
  const favoritePrompts = await db.collection(promptCollection).countDocuments({ userId, favorite: true });
  const avgScoreResult = await db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: null, avgScore: { $avg: '$score' } } },
  ]).toArray();
  const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore * 10) / 10 : 0;
  return { totalPrompts, favoritePrompts, avgScore };
}

export async function getPromptsOverTime(userId: string) {
  const db = getDb();
  return db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();
}

export async function getCategoryUsage(userId: string) {
  const db = getDb();
  return db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();
}

export async function getModelUsage(userId: string) {
  const db = getDb();
  return db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: '$targetModel', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();
}

export async function getScoreTrends(userId: string) {
  const db = getDb();
  return db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, avgScore: { $avg: '$score' } } },
    { $sort: { _id: 1 } },
  ]).toArray();
}

export async function trackEvent(userId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  const db = getDb();
  await db.collection(analyticsCollection).insertOne({ userId, eventType, metadata, createdAt: new Date() });
}
