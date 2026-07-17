import { ObjectId } from 'mongodb';

export interface Analytics {
  _id?: ObjectId;
  userId: string;
  eventType: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export const analyticsCollection = 'analytics';
