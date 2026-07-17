import { ObjectId } from 'mongodb';

export interface Review {
  _id?: ObjectId;
  templateId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const reviewCollection = 'reviews';
