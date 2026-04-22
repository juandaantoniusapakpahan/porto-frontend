import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FileText, Mail } from 'lucide-react';
import { GithubIcon } from '../../components/ui/SocialIcons';
import { authService } from '../../api/services/authService';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  usernameOrEmail: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      const { accessToken, refreshToken, user } = res.data.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { message?: string; detail?: string } } })?.response?.data;
      toast.error(d?.detail || d?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PortfolioBuilder</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to manage your portfolio</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
          {/* GitHub OAuth */}
          <Button
            variant="github"
            className="w-full mb-6"
            icon={<GithubIcon className="w-4 h-4" />}
            onClick={() => authService.loginWithGithub()}
          >
            Continue with GitHub
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email or Username"
              type="text"
              icon={<Mail className="w-4 h-4" />}
              error={errors.usernameOrEmail?.message}
              {...register('usernameOrEmail')}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex justify-end">
              <a href="#" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
