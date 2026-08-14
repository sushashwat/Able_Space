import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, ColorMode } from '@/lib/types/user';

interface ThemeState {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (colorMode: ColorMode) => void;
  applyToDOM: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      colorMode: 'blue',

      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      setColorMode: (colorMode) => {
        set({ colorMode });
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-color-mode', colorMode);
        }
      },

      applyToDOM: () => {
        const { theme, colorMode } = get();
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
          document.documentElement.setAttribute('data-color-mode', colorMode);
        }
      },
    }),
    {
      name: 'theme-storage', // localStorage key
    },
  ),
);