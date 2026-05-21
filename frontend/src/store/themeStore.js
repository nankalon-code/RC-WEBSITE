import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('rc_theme') || 'dark',

  toggle: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('rc_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next === 'light');
      return { theme: next };
    }),

  init: () =>
    set((state) => {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
      document.documentElement.classList.toggle('light', state.theme === 'light');
      return state;
    }),
}));
