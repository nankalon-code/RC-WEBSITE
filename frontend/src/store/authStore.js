import { create } from 'zustand';
import { apiFetch } from '../utils/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  init: () => {
    const token = localStorage.getItem('rc_token');
    const user = localStorage.getItem('rc_user');
    if (token && user) {
      set({ token, user: JSON.parse(user), isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('rc_token', data.access_token);
    localStorage.setItem('rc_user', JSON.stringify(data.user));
    set({ token: data.access_token, user: data.user, isAuthenticated: true });
    return data.user;
  },

  register: async (name, email, password, github_url, student_id, phone) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, github_url, student_id, phone }),
    });
    localStorage.setItem('rc_token', data.access_token);
    localStorage.setItem('rc_user', JSON.stringify(data.user));
    set({ token: data.access_token, user: data.user, isAuthenticated: true });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('rc_token');
    localStorage.removeItem('rc_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
