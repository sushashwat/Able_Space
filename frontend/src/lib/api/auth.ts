import { apiClient } from './client';
import type { AuthResponse, User } from '@/lib/types/user';

export async function guestLogin(): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/guest');
  return data;
}

export function googleLoginUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}