import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'purple';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3',
};

const colorStyles = {
  indigo: 'bg-indigo-600 dark:bg-indigo-500',
  emerald: 'bg-emerald-600 dark:bg-emerald-500',
  amber: 'bg-amber-600 dark:bg-amber-500',
  red: 'bg-red-600 dark:bg-red-500',
  purple: 'bg-purple-600 dark:bg-purple-500',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'indigo',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full ${colorStyles[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
