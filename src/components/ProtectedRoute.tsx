import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { profileService } from '../api/services/profileService';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, accessToken, refreshToken, setTokens, setUser, logout } = useAuthStore();
  const [checking, setChecking] = useState(!accessToken);
  const location = useLocation();

  useEffect(() => {
    if (accessToken) {
      setChecking(false);
      return;
    }

    if (!refreshToken) {
      setChecking(false);
      return;
    }

    // Try to restore session using persisted refresh token
    (async () => {
      try {
        const { data } = await api.post('/api/auth/refresh', { refreshToken });
        setTokens(data.data.accessToken, data.data.refreshToken);
        const profileRes = await profileService.get();
        setUser(profileRes.data.data);
      } catch {
        logout();
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
