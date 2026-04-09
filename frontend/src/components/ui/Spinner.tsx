import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, label }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin',
          sizeStyles[size]
        )}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <span className="ml-2 text-gray-600">{label}</span>}
    </div>
  );
};
