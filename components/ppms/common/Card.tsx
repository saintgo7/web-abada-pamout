import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  onClick,
}) => {
  return (
    <div
      className={`bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800/50 rounded-2xl shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700' : ''
      } ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/50">
          {title && (
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'p-6' : 'p-6'}>{children}</div>
    </div>
  );
};
