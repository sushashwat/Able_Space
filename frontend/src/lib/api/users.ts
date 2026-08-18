import { apiClient } from './client';
import type { UserSummary } from '@/lib/types/user';

export async function getAllUsers(): Promise<UserSummary[]> {
  const { data } = await apiClient.get<UserSummary[]>('/users');
  return data;
}