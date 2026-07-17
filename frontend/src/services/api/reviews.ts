import { apiFetch } from '@/lib/api';

export interface Review {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
}

export function getReviews() {
  return apiFetch<Review[]>('/reviews');
}

export function createReview(payload: CreateReviewPayload) {
  return apiFetch<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateReview(id: string, payload: Partial<CreateReviewPayload>) {
  return apiFetch<Review>(`/reviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteReview(id: string) {
  return apiFetch<void>(`/reviews/${id}`, {
    method: 'DELETE',
  });
}
