import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { profileService } from '../../api/services/profileService';
import { Loader2 } from 'lucide-react';

export const OAuthCallbackPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=oauth_failed');
      return;
    }

    (async () => {
      try {
        setAccessToken(token);
        const res = await profileService.get();
        setUser(res.data.data);
        navigate('/dashboard');
      } catch {
        navigate('/login?error=oauth_failed');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Completing sign-in...</p>
      </div>
    </div>
  );
};
