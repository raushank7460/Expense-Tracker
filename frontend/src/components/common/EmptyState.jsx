import React from 'react';
import Button from './Button';
import { HiOutlineFolderPlus } from 'react-icons/hi2';

export const EmptyState = ({
  title = 'No records found',
  subtitle = 'Get started by adding your first record.',
  actionLabel,
  onAction,
  icon = <HiOutlineFolderPlus className="w-10 h-10 text-brand-500" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 glass-card rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 animate-fade-in my-4">
      <div className="p-4 bg-brand-500/10 rounded-2xl mb-4 ring-8 ring-brand-500/5">
        {icon}
      </div>
      <h4 className="text-base font-bold text-slate-800 dark:text-white font-heading">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        {subtitle}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
