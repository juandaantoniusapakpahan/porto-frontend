import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rect' }) => (
  <div
    className={cn(
      'skeleton',
      variant === 'circle' && 'rounded-full',
      variant === 'line' && 'rounded-md h-4',
      variant === 'rect' && 'rounded-xl',
      className
    )}
  />
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="line" className="w-3/4" />
        <Skeleton variant="line" className="w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20" />
    <div className="flex gap-2">
      <Skeleton variant="line" className="w-16 h-6 rounded-full" />
      <Skeleton variant="line" className="w-20 h-6 rounded-full" />
      <Skeleton variant="line" className="w-14 h-6 rounded-full" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonForm: React.FC = () => (
  <div className="space-y-5">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-14" />
    ))}
    <Skeleton className="h-24" />
    <Skeleton className="h-11 w-32" />
  </div>
);
