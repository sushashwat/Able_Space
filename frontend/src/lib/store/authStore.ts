import { create } from 'zustand';
import type { AuthUser, User } from '@/lib/types/user';

interface AuthState {
  user: AuthUser | User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      //  for Middleware
      document.cookie = `access_token=${token}; path=/; max-age=604800`; // 7 din
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      document.cookie = 'access_token=; path=/; max-age=0';
    }
    set({ user: null, isAuthenticated: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));