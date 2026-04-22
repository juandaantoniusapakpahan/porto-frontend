import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
    <div className="text-center">
      <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  </div>
);
