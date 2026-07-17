import { ObjectId } from 'mongodb';

export interface Collection {
  _id?: ObjectId;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionCollection = 'collections';
