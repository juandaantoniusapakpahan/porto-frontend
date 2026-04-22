import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, glass = false }) => (
  <div className={cn(
    'rounded-2xl border bg-white shadow-card',
    hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300',
    glass && 'bg-white/80 backdrop-blur-xl border-white/20',
    className
  )}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('px-6 py-5 border-b border-gray-100', className)}>{children}</div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('px-6 py-5', className)}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl', className)}>{children}</div>
);
