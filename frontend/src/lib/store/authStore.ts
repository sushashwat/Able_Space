import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
          document.cookie = `access_token=${token}; path=/; max-age=604800`;
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);