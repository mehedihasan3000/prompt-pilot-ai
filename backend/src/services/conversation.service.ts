import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { conversationCollection, Conversation } from '../models/conversation.model';
import { messageCollection, Message } from '../models/message.model';

export async function create(userId: string, title: string): Promise<Conversation> {
  const db = getDb();
  const now = new Date();
  const doc: Conversation = { userId, title, createdAt: now, updatedAt: now };
  const result = await db.collection(conversationCollection).insertOne(doc);
  return { ...doc, _id: result.insertedId } as unknown as Conversation;
}

export async function findAll(userId: string) {
  const db = getDb();
  return db.collection(conversationCollection).find({ userId }).sort({ updatedAt: -1 }).toArray();
}

export async function findById(id: string, userId: string): Promise<Conversation | null> {
  const db = getDb();
  return db.collection(conversationCollection).findOne({ _id: new ObjectId(id), userId }) as Promise<Conversation | null>;
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection(conversationCollection).deleteOne({ _id: new ObjectId(id), userId });
  if (result.deletedCount > 0) {
    await db.collection(messageCollection).deleteMany({ conversationId: id });
  }
  return result.deletedCount > 0;
}

export async function getMessages(conversationId: string, userId: string) {
  const db = getDb();
  const conversation = await db.collection(conversationCollection).findOne({ _id: new ObjectId(conversationId), userId });
  if (!conversation) return [];
  return db.collection(messageCollection).find({ conversationId }).sort({ createdAt: 1 }).toArray();
}

export async function addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
  const db = getDb();
  const now = new Date();
  const doc: Message = { conversationId, role, content, createdAt: now };
  const result = await db.collection(messageCollection).insertOne(doc);
  await db.collection(conversationCollection).updateOne(
    { _id: new ObjectId(conversationId) },
    { $set: { updatedAt: now } }
  );
  return { ...doc, _id: result.insertedId } as unknown as Message;
}
