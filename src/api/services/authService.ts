import api from '../axios';
import { API_URL } from '../axios';
import type { LoginPayload, RegisterPayload } from '../../types';

export const authService = {
  register: (data: RegisterPayload) =>
    api.post('/api/auth/register', data),

  login: (data: LoginPayload) =>
    api.post('/api/auth/login', data),

  logout: () =>
    api.post('/api/auth/logout'),

  refreshToken: () =>
    api.post('/api/auth/refresh'),

  loginWithGithub: () => {
    window.location.href = `${API_URL}/api/auth/oauth2/github`;
  },
};
