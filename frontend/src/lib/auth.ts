import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();

export function useSession() {
  return authClient.useSession();
}

export async function signIn(email: string, password: string) {
  return authClient.signIn.email({ email, password });
}

export async function signUp(name: string, email: string, password: string) {
  return authClient.signUp.email({ name, email, password });
}

export async function signOut() {
  return authClient.signOut();
}
