import api from '../axios';

export const profileService = {
  get: () => api.get('/api/profile'),
  update: (data: Record<string, unknown>) => api.put('/api/profile', data),
  delete: () => api.delete('/api/profile'),
};
