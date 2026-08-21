import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';
import CategoryIcon from '../common/CategoryIcon';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from 'react-icons/hi2';

export const RecentTransactions = ({ transactions = [], onAddExpense, onAddIncome }) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
            Recent Transactions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your latest income and expense activities
          </p>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          View All ({transactions.length}) →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
          <p className="text-xs font-medium">No recent transactions recorded yet</p>
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={onAddIncome}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              + Add Income
            </button>
            <button
              onClick={onAddExpense}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              + Add Expense
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {transactions.slice(0, 5).map((t) => {
            const isIncome = t.type === 'income';
            return (
              <div
                key={t._id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <HiOutlineArrowTrendingUp className="w-5 h-5" />
                    ) : (
                      <CategoryIcon icon={t.category} className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {t.title}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span>{t.category || (isIncome ? 'Income' : 'Expense')}</span>
                      <span>•</span>
                      <span>{formatDate(t.date, { short: true })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </span>
                  <p className="text-[10px] text-slate-400">{t.paymentMethod || 'Direct'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
