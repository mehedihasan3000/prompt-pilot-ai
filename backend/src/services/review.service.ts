import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { reviewCollection, Review } from '../models/review.model';
import { templateCollection } from '../models/template.model';

export async function create(templateId: string, userId: string, data: { rating: number; comment: string }): Promise<Review> {
  const db = getDb();
  const now = new Date();
  const doc: Review = {
    templateId,
    userId,
    rating: data.rating,
    comment: data.comment,
    createdAt: now,
  };
  const result = await db.collection(reviewCollection).insertOne(doc);

  const stats = await db.collection(reviewCollection).aggregate([
    { $match: { templateId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]).toArray();

  if (stats.length > 0) {
    await db.collection(templateCollection).updateOne(
      { _id: new ObjectId(templateId) },
      { $set: { averageRating: Math.round(stats[0].avg * 10) / 10 } }
    );
  }

  return { ...doc, _id: result.insertedId } as unknown as Review;
}

export async function findAllByTemplate(templateId: string) {
  const db = getDb();
  return db.collection(reviewCollection).find({ templateId }).sort({ createdAt: -1 }).toArray();
}

export async function update(id: string, userId: string, data: Partial<Review>): Promise<Review | null> {
  const db = getDb();
  const result = await db.collection(reviewCollection).findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { ...data } },
    { returnDocument: 'after' }
  );
  return result as unknown as Review | null;
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const review = await db.collection(reviewCollection).findOne({ _id: new ObjectId(id), userId });
  if (!review) return false;
  await db.collection(reviewCollection).deleteOne({ _id: new ObjectId(id) });
  const stats = await db.collection(reviewCollection).aggregate([
    { $match: { templateId: review.templateId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]).toArray();
  if (stats.length > 0) {
    await db.collection(templateCollection).updateOne(
      { _id: new ObjectId(review.templateId) },
      { $set: { averageRating: Math.round(stats[0].avg * 10) / 10 } }
    );
  } else {
    await db.collection(templateCollection).updateOne(
      { _id: new ObjectId(review.templateId) },
      { $set: { averageRating: 0 } }
    );
  }
  return true;
}
