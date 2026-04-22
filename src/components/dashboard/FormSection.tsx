import React from 'react';
import { cn } from '../../utils';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title, description, icon, children, className,
}) => (
  <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden', className)}>
    <div className="px-6 py-5 border-b border-gray-50 flex items-start gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);
