import axios from 'axios';
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  GraphData,
  RecommendationResponse,
  FeedbackPayload,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchUsers = (): Promise<User[]> =>
  api.get<any>('/users').then((r) => r.data.data);

export const createUser = (payload: CreateUserPayload): Promise<User> =>
  api.post<any>('/users', payload).then((r) => r.data.data);

export const updateUser = (id: string, payload: UpdateUserPayload): Promise<User> =>
  api.put<any>(`/users/${id}`, payload).then((r) => r.data.data);

export const deleteUser = (id: string): Promise<void> =>
  api.delete(`/users/${id}`).then(() => undefined);

// ─── Relationships ─────────────────────────────────────────────────────────────
export const linkUsers = (id: string, targetUserId: string): Promise<User> =>
  api.post<any>(`/users/${id}/link`, { friendId: targetUserId }).then((r) => r.data.data);

export const unlinkUsers = (id: string, targetUserId: string): Promise<User> =>
  api.delete<any>(`/users/${id}/unlink`, { data: { friendId: targetUserId } }).then((r) => r.data.data);

// ─── Graph ─────────────────────────────────────────────────────────────────────
export const fetchGraph = (): Promise<GraphData> =>
  api.get<any>('/graph').then((r) => r.data.data);

// ─── Recommendations ───────────────────────────────────────────────────────────
export const fetchRecommendations = (id: string): Promise<RecommendationResponse> =>
  api.get<any>(`/users/${id}/recommendations`).then((r) => r.data.data);

export const submitFeedback = (id: string, payload: FeedbackPayload): Promise<void> =>
  api.post(`/users/${id}/recommendations/feedback`, payload).then(() => undefined);

export default api;