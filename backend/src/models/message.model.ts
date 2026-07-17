import { ObjectId } from 'mongodb';

export interface Message {
  _id?: ObjectId;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export const messageCollection = 'messages';
