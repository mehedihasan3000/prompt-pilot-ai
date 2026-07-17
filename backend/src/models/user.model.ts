export interface User {
  _id?: import('mongodb').ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: 'credentials' | 'google';
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export const userCollection = 'users';
