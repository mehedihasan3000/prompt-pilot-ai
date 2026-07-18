export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  session: {
    id: string;
    expiresAt: string;
    token: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
