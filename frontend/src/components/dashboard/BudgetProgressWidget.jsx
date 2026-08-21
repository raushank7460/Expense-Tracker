import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { HiOutlineExclamationTriangle, HiOutlineCheckCircle } from 'react-icons/hi2';

export const BudgetProgressWidget = ({ budgets = [], meta = null }) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
            Monthly Budget Status
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {meta?.month
              ? `${new Date(2025, meta.month - 1).toLocaleString('default', { month: 'long' })} ${
                  meta.year
                }`
              : 'Current Month'}
          </p>
        </div>
        <Link
          to="/budgets"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Manage All →
        </Link>
      </div>

      {budgets.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
          <p className="text-xs font-medium">No budgets created for this month yet</p>
          <Link
            to="/budgets"
            className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
          >
            + Create First Budget
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.slice(0, 4).map((b) => {
            const isExceeded = b.percentage >= 100;
            const isWarning = b.percentage >= 75 && b.percentage < 100;

            let barColor = 'bg-emerald-500';
            if (isExceeded) barColor = 'bg-rose-500';
            else if (isWarning) barColor = 'bg-amber-500';

            return (
              <div key={b._id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <span>{b.category}</span>
                    {isExceeded && (
                      <span className="text-[10px] text-rose-500 font-bold flex items-center">
                        <HiOutlineExclamationTriangle className="w-3.5 h-3.5 mr-0.5" /> Exceeded!
                      </span>
                    )}
                    {isWarning && (
                      <span className="text-[10px] text-amber-500 font-bold flex items-center">
                        <HiOutlineExclamationTriangle className="w-3.5 h-3.5 mr-0.5" /> Close to limit
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(b.spent)}
                    </span>{' '}
                    / {formatCurrency(b.amount)}
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(b.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetProgressWidget;
