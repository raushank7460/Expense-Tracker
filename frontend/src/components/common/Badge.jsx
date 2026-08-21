import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'custom'
  color,
  size = 'md', // 'sm' | 'md'
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  if (color) {
    return (
      <span
        style={{
          backgroundColor: `${color}15`,
          color: color,
          borderColor: `${color}30`,
        }}
        className={`inline-flex items-center font-semibold rounded-full border ${sizeStyles[size]} ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeStyles[size]} ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
