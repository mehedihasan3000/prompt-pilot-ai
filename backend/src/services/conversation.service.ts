import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { conversationCollection, Conversation } from '../models/conversation.model';
import { messageCollection, Message } from '../models/message.model';
import { mapDoc, mapDocs } from '../utils/mapDoc';

export async function create(userId: string, title: string): Promise<Conversation> {
  const db = getDb();
  const now = new Date();
  const doc: Conversation = { userId, title, createdAt: now, updatedAt: now };
  const result = await db.collection(conversationCollection).insertOne(doc);
  return mapDoc<Conversation>({ ...doc, _id: result.insertedId })!;
}

export async function findAll(userId: string) {
  const db = getDb();
  const docs = await db.collection(conversationCollection).find({ userId }).sort({ updatedAt: -1 }).toArray();
  return mapDocs<Conversation>(docs);
}

export async function findById(id: string, userId: string): Promise<Conversation | null> {
  const db = getDb();
  const doc = await db.collection(conversationCollection).findOne({ _id: new ObjectId(id), userId });
  return mapDoc<Conversation>(doc);
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
  const docs = await db.collection(messageCollection).find({ conversationId }).sort({ createdAt: 1 }).toArray();
  return mapDocs<Message>(docs);
}

export async function updateTitle(id: string, userId: string, title: string): Promise<void> {
  const db = getDb();
  await db.collection(conversationCollection).updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { title, updatedAt: new Date() } }
  );
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
  return mapDoc<Message>({ ...doc, _id: result.insertedId })!;
}
