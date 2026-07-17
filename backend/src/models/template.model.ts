import { ObjectId } from 'mongodb';

export interface Template {
  _id?: ObjectId;
  userId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  promptContent: string;
  category: string;
  targetModel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tone?: string;
  outputType?: string;
  tags: string[];
  imageUrl?: string;
  visibility: 'public' | 'private';
  usageCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export const templateCollection = 'templates';
