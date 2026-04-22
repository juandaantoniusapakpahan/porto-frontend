import api from '../axios';

export const publicService = {
  getPortfolio: (username: string) =>
    api.get(`/api/public/${username}`),

  downloadPdf: async (username: string) => {
    const res = await api.get(`/api/public/${username}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${username}-portfolio.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
