import { getDb } from '../config/db';
import { promptCollection } from '../models/prompt.model';
import { templateCollection } from '../models/template.model';
import { analyticsCollection } from '../models/analytics.model';

export async function getSummary(userId: string) {
  const db = getDb();
  const totalPrompts = await db.collection(promptCollection).countDocuments({ userId });
  const favoritePrompts = await db.collection(promptCollection).countDocuments({ userId, favorite: true });
  const totalTemplates = await db.collection(templateCollection).countDocuments({ userId });

  const avgScoreResult = await db.collection(promptCollection).aggregate([
    { $match: { userId, score: { $gt: 0 } } },
    { $group: { _id: null, avgScore: { $avg: '$score' } } },
  ]).toArray();
  const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore * 10) / 10 : 0;

  const mostUsedModelResult = await db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: '$targetModel', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]).toArray();
  const mostUsedModel = mostUsedModelResult.length > 0 ? mostUsedModelResult[0]._id : null;

  const mostUsedCategoryResult = await db.collection(promptCollection).aggregate([
    { $match: { userId } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]).toArray();
  const mostUsedCategory = mostUsedCategoryResult.length > 0 ? mostUsedCategoryResult[0]._id : null;

  return { totalPrompts, favoritePrompts, averageScore, totalTemplates, mostUsedModel, mostUsedCategory };
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
  const total = await db.collection(promptCollection).countDocuments({ userId });
  type AggResult = { _id: string; count: number };
  const data = await db.collection(promptCollection).aggregate<AggResult>([
    { $match: { userId } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();
  return data.map((d) => ({
    name: d._id,
    count: d.count,
    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
  }));
}

export async function getModelUsage(userId: string) {
  const db = getDb();
  const total = await db.collection(promptCollection).countDocuments({ userId });
  type AggResult = { _id: string; count: number };
  const data = await db.collection(promptCollection).aggregate<AggResult>([
    { $match: { userId } },
    { $group: { _id: '$targetModel', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).toArray();
  return data.map((d) => ({
    name: d._id,
    count: d.count,
    percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
  }));
}

export async function getScoreTrends(userId: string) {
  const db = getDb();
  return db.collection(promptCollection).aggregate([
    { $match: { userId, score: { $gt: 0 } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, averageScore: { $avg: '$score' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', averageScore: 1, count: 1, _id: 0 } },
  ]).toArray();
}

export async function getRecentActivity(userId: string) {
  const db = getDb();
  const recentPrompts = await db.collection(promptCollection)
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .project({ _id: 1, title: 1, score: 1, createdAt: 1, targetModel: 1 })
    .toArray();
  return recentPrompts;
}

export async function trackEvent(userId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  const db = getDb();
  await db.collection(analyticsCollection).insertOne({ userId, eventType, metadata, createdAt: new Date() });
}
