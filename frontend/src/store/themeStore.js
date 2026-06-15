import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',

  toggle: () => {},

  init: () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  },
}));
