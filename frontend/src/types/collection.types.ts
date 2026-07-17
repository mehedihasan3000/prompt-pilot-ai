export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  isPublic: boolean;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  description?: string;
  color?: string;
  isPublic?: boolean;
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string;
  color?: string;
  isPublic?: boolean;
}
