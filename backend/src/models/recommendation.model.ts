import { ObjectId } from 'mongodb';

export interface Recommendation {
  _id?: ObjectId;
  userId: string;
  promptId?: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export const recommendationCollection = 'recommendations';
