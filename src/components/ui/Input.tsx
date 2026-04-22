import React, { useState } from 'react';
import { cn } from '../../utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, type, ...props }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <div className={cn('relative', icon && 'has-icon')}>
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          placeholder=" "
          className={cn(
            'peer w-full px-4 pt-6 pb-2 text-sm text-gray-900 bg-white border rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            icon && 'pl-10',
            isPassword && 'pr-12',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-gray-300',
            className
          )}
          {...props}
        />
        <label className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 pointer-events-none',
          'peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary-600',
          'peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500',
          icon && 'left-10',
        )}>
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => (
  <div className="w-full">
    <div className="relative">
      <textarea
        placeholder=" "
        rows={4}
        className={cn(
          'peer w-full px-4 pt-6 pb-2 text-sm text-gray-900 bg-white border rounded-xl resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
          className
        )}
        {...props}
      />
      <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all duration-200 pointer-events-none
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-600
        peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500">
        {label}
      </label>
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => (
  <div className="w-full">
    <div className="relative">
      <select
        className={cn(
          'w-full px-4 pt-6 pb-2 text-sm text-gray-900 bg-white border rounded-xl appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
          className
        )}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <label className="absolute left-4 top-2 text-xs text-gray-500 pointer-events-none">
        {label}
      </label>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);
