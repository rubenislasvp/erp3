
import React from 'react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-white ${sizeClasses[size]}`} role="status">
        <span className="sr-only">Loading...</span>
    </div>
  );
};

export const FullPageSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);
