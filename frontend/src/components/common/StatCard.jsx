import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export const StatCard = ({
  title,
  amount,
  isCurrency = true,
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon,
  iconBgColor = 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
  badgeText,
  subtitle,
}) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-brand-500/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${iconBgColor} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          {isCurrency ? formatCurrency(amount) : amount}
        </h3>
      </div>

      {(subtitle || badgeText || change !== undefined) && (
        <div className="mt-2.5 flex items-center text-xs space-x-2">
          {badgeText && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {badgeText}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>
          )}
          {change !== undefined && (
            <span
              className={`font-semibold flex items-center ${
                changeType === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
