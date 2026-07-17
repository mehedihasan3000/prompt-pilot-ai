import { ObjectId } from 'mongodb';

export interface Conversation {
  _id?: ObjectId;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export const conversationCollection = 'conversations';
