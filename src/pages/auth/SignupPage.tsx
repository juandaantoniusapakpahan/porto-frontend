import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, AtSign, FileText } from 'lucide-react';
import { authService } from '../../api/services/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, - and _ allowed'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string; detail?: string; data?: Record<string, string> } } };
      const fieldErrors = apiErr.response?.data?.data;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          setError(field as keyof FormValues, { message: msg });
        });
      } else {
        toast.error(apiErr.response?.data?.detail || apiErr.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PortfolioBuilder</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">Build and share your professional portfolio</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username (your portfolio URL slug)"
              type="text"
              icon={<AtSign className="w-4 h-4" />}
              error={errors.username?.message}
              {...register('username')}
            />
            <p className="text-xs text-gray-400 -mt-2 ml-1">
              Your portfolio will be at /portfolio/<strong>username</strong>
            </p>
            <Input
              label="Email Address"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
