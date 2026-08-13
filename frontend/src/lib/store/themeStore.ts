import { create } from 'zustand';
import type { Theme, ColorMode } from '@/lib/types/user';

interface ThemeState {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (colorMode: ColorMode) => void;
  initFromUser: (theme: Theme, colorMode: ColorMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
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

  initFromUser: (theme, colorMode) => {
    set({ theme, colorMode });
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.setAttribute('data-color-mode', colorMode);
    }
  },
}));