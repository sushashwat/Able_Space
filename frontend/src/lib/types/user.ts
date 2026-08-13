

export type Theme = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  isGuest: boolean;
}

export interface User extends AuthUser {
  title: string;
  username: string;
  theme: Theme;
  colorMode: ColorMode;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}