import { apiFetch } from '@/lib/api';

export interface Review {
  id: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
}

export function getTemplateReviews(templateId: string) {
  return apiFetch<Review[]>(`/templates/${templateId}/reviews`);
}

export function createTemplateReview(templateId: string, payload: CreateReviewPayload) {
  return apiFetch<Review>(`/templates/${templateId}/reviews`, {
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
