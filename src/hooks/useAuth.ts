import { useAuthStore } from '../store/authStore';
import { authService } from '../api/services/authService';
import { profileService } from '../api/services/profileService';
import toast from 'react-hot-toast';

export function useAuth() {
  const { accessToken, user, isAuthenticated, setAccessToken, setUser, logout: storeLogout } = useAuthStore();

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // ignore errors on logout
    } finally {
      storeLogout();
    }
  }

  async function initFromOAuth(token: string) {
    setAccessToken(token);
    const res = await profileService.get();
    setUser(res.data.data);
  }

  async function refreshUser() {
    try {
      const res = await profileService.get();
      setUser(res.data.data);
    } catch {
      toast.error('Failed to load user profile');
    }
  }

  return {
    accessToken,
    user,
    isAuthenticated,
    setAccessToken,
    setUser,
    logout,
    initFromOAuth,
    refreshUser,
  };
}
