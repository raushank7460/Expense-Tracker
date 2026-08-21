import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { getCategoryColor } from '../../utils/formatters';

export const CategoryPieChart = ({ data = [], totalExpense = 0, title = 'Category Breakdown' }) => {
  const { formatCurrency } = useCurrency();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 rounded-xl shadow-xl text-xs border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100">{item.category}</p>
          <div className="flex items-center justify-between space-x-3">
            <span className="text-slate-500">Amount:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(item.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-3">
            <span className="text-slate-500">Share:</span>
            <span className="font-semibold text-brand-500">{item.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = data && data.length > 0 && totalExpense > 0;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribution across spending categories
        </p>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
          <p className="text-sm font-medium">No category spending data available</p>
          <p className="text-xs mt-1">Add expenses to see your top categories</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Donut Chart with Center Total */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || getCategoryColor(entry.category)}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Spent
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-heading">
                {formatCurrency(totalExpense)}
              </span>
            </div>
          </div>

          {/* Category Legend List */}
          <div className="flex-1 w-full max-h-48 overflow-y-auto space-y-2 pr-1">
            {data.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 text-xs"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || getCategoryColor(item.category) }}
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
