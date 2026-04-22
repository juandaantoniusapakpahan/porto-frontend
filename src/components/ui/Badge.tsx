import React from 'react';
import { cn } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'gray' | 'green' | 'yellow' | 'red' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', size = 'sm', className }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border border-primary-200',
    accent: 'bg-accent-100 text-accent-700 border border-accent-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    green: 'bg-green-100 text-green-700 border border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
