import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-5 animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24"></div>
      <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
    <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-md w-36"></div>
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-20"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="glass-card rounded-2xl p-4 animate-pulse space-y-4">
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="flex justify-between items-center mb-6">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-36"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-28"></div>
    </div>
    <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
  </div>
);

export default { SkeletonCard, SkeletonTable, SkeletonChart };
