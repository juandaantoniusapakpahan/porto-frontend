import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';
import { cn } from '../../utils';

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent?: 'primary' | 'accent';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title, subtitle, accent = 'primary' }) => {
  const [ref, visible] = useIntersection<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center text-center mb-16 transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className={cn(
        'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg',
        accent === 'primary' ? 'bg-primary-600 text-white shadow-glow' : 'bg-accent-500 text-white shadow-glow-teal',
      )}>
        {icon}
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
      <div className={cn(
        'w-12 h-1 rounded-full mt-2',
        accent === 'primary' ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gradient-to-r from-accent-500 to-primary-500',
      )} />
      {subtitle && <p className="text-gray-500 mt-4 max-w-md">{subtitle}</p>}
    </div>
  );
};
