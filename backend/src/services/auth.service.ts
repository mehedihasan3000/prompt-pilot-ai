import bcrypt from 'bcryptjs';
import { URLSearchParams } from 'url';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db';
import { userCollection, User } from '../models/user.model';
import { env } from '../config/env';

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const db = getDb();
  const existing = await db.collection(userCollection).findOne({ email });
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const now = new Date();
  const user: User = {
    name,
    email,
    password: hashedPassword,
    provider: 'credentials',
    role: 'user',
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(userCollection).insertOne(user);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword as Omit<User, 'password'>, token: result.insertedId.toString() };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const db = getDb();
  const user = await db.collection(userCollection).findOne({ email });
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }
  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword as unknown as Omit<User, 'password'>, token: user._id.toString() };
}

export async function googleAuth(googleData: { name: string; email: string; image?: string }): Promise<AuthResponse> {
  const db = getDb();
  let user = await db.collection(userCollection).findOne({ email: googleData.email });
  if (!user) {
    const now = new Date();
    const newUser: User = {
      name: googleData.name,
      email: googleData.email,
      image: googleData.image,
      provider: 'google',
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(userCollection).insertOne(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword as Omit<User, 'password'>, token: result.insertedId.toString() };
  }
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword as unknown as Omit<User, 'password'>, token: user._id.toString() };
}

export function getGoogleUrl(): string {
  const redirectUri = `${env.BETTER_AUTH_URL}/api/auth/callback/google`;
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function handleGoogleCallback(code: string): Promise<AuthResponse> {
  const redirectUri = `${env.BETTER_AUTH_URL}/api/auth/callback/google`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw Object.assign(new Error(`Google token exchange failed: ${errorBody}`), { statusCode: 400 });
  }

  const tokens = await tokenResponse.json() as { access_token: string };
  const accessToken = tokens.access_token;

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userInfoResponse.ok) {
    throw Object.assign(new Error('Failed to fetch Google user info'), { statusCode: 400 });
  }

  const googleUser = await userInfoResponse.json() as { name: string; email: string; picture?: string };
  const { name, email, picture } = googleUser;

  return googleAuth({ name, email, image: picture });
}

export async function demoLogin(): Promise<AuthResponse> {
  const db = getDb();
  let user = await db.collection(userCollection).findOne({ email: 'demo@promptpilot.ai' });
  if (!user) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('Pa$$w0rd!', 12);
    const newUser: User = {
      name: 'Demo User',
      email: 'demo@promptpilot.ai',
      password: hashedPassword,
      provider: 'credentials',
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(userCollection).insertOne(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword as Omit<User, 'password'>, token: result.insertedId.toString() };
  }
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword as unknown as Omit<User, 'password'>, token: user._id.toString() };
}

export async function logout(userId: string): Promise<void> {
  return;
}

export async function getMe(userId: string): Promise<Omit<User, 'password'>> {
  const db = getDb();
  const user = await db.collection(userCollection).findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as unknown as Omit<User, 'password'>;
}

export async function updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'image'>>): Promise<Omit<User, 'password'>> {
  const db = getDb();
  await db.collection(userCollection).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } }
  );
  const user = await db.collection(userCollection).findOne({ _id: new ObjectId(userId) });
  const { password: _, ...userWithoutPassword } = user!;
  return userWithoutPassword as unknown as Omit<User, 'password'>;
}

export async function deleteAccount(userId: string): Promise<void> {
  const db = getDb();
  await db.collection(userCollection).deleteOne({ _id: new ObjectId(userId) });
}
