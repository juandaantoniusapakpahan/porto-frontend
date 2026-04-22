import api from '../axios';

export const portfolioService = {
  // Personal Info
  getPersonalInfo: () => api.get('/api/portfolio/personal-info'),
  updatePersonalInfo: (data: unknown) => api.put('/api/portfolio/personal-info', data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/portfolio/personal-info/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAvatar: () => api.delete('/api/portfolio/personal-info/avatar'),

  // Summary
  getSummary: () => api.get('/api/portfolio/summary'),
  updateSummary: (data: unknown) => api.put('/api/portfolio/summary', data),

  // Work Experience
  getExperiences: () => api.get('/api/portfolio/experiences'),
  createExperience: (data: unknown) => api.post('/api/portfolio/experiences', data),
  updateExperience: (id: string, data: unknown) => api.put(`/api/portfolio/experiences/${id}`, data),
  deleteExperience: (id: string) => api.delete(`/api/portfolio/experiences/${id}`),

  // Education
  getEducations: () => api.get('/api/portfolio/educations'),
  createEducation: (data: unknown) => api.post('/api/portfolio/educations', data),
  updateEducation: (id: string, data: unknown) => api.put(`/api/portfolio/educations/${id}`, data),
  deleteEducation: (id: string) => api.delete(`/api/portfolio/educations/${id}`),

  // Skills
  getSkills: () => api.get('/api/portfolio/skills'),
  createSkill: (data: unknown) => api.post('/api/portfolio/skills', data),
  updateSkill: (id: string, data: unknown) => api.put(`/api/portfolio/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/api/portfolio/skills/${id}`),

  // Certifications
  getCertifications: () => api.get('/api/portfolio/certifications'),
  createCertification: (data: unknown) => api.post('/api/portfolio/certifications', data),
  updateCertification: (id: string, data: unknown) => api.put(`/api/portfolio/certifications/${id}`, data),
  deleteCertification: (id: string) => api.delete(`/api/portfolio/certifications/${id}`),

  // Projects
  getProjects: () => api.get('/api/portfolio/projects'),
  createProject: (data: unknown) => api.post('/api/portfolio/projects', data),
  updateProject: (id: string, data: unknown) => api.put(`/api/portfolio/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/api/portfolio/projects/${id}`),

  // Awards
  getAwards: () => api.get('/api/portfolio/awards'),
  createAward: (data: unknown) => api.post('/api/portfolio/awards', data),
  updateAward: (id: string, data: unknown) => api.put(`/api/portfolio/awards/${id}`, data),
  deleteAward: (id: string) => api.delete(`/api/portfolio/awards/${id}`),

  // Languages
  getLanguages: () => api.get('/api/portfolio/languages'),
  createLanguage: (data: unknown) => api.post('/api/portfolio/languages', data),
  updateLanguage: (id: string, data: unknown) => api.put(`/api/portfolio/languages/${id}`, data),
  deleteLanguage: (id: string) => api.delete(`/api/portfolio/languages/${id}`),
};
