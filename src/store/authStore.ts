import { create } from 'zustand';
import type { User } from '../types';

const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  user: null,
  isAuthenticated: false,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: true }),

  setUser: (user) =>
    set({ user }),

  logout: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },
}));
