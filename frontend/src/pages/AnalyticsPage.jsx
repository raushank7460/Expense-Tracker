import React, { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { printFinancialReport } from '../utils/exportUtils';

import Button from '../components/common/Button';
import StatCard from '../components/common/StatCard';
import IncomeVsExpenseChart from '../components/dashboard/IncomeVsExpenseChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import { SkeletonCard, SkeletonChart } from '../components/common/SkeletonLoader';

import {
  HiOutlinePrinter,
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineScale,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineCalendar,
} from 'react-icons/hi2';

export const AnalyticsPage = () => {
  const { formatCurrency } = useCurrency();
  const { showToast } = useToast();

  const [period, setPeriod] = useState('this_month'); // 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [insights, setInsights] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const query = {
        period,
        startDate: period === 'custom' ? startDate : undefined,
        endDate: period === 'custom' ? endDate : undefined,
      };

      const [summaryRes, monthlyRes, categoryRes, insightsRes] = await Promise.all([
        analyticsService.getSummary(query),
        analyticsService.getMonthlyAnalytics(query),
        analyticsService.getCategoryAnalytics(query),
        analyticsService.getInsights(),
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (monthlyRes.success) setMonthlyData(monthlyRes.data);
      if (categoryRes.success) {
        setCategoryData(categoryRes.data);
        setCategoryTotal(categoryRes.totalExpense || 0);
      }
      if (insightsRes.success) setInsights(insightsRes.data);
    } catch (err) {
      showToast('Failed to load financial analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Date Range Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Financial Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into your cash flow patterns, category spending, and savings trajectories
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={printFinancialReport}
          icon={<HiOutlinePrinter className="w-4 h-4" />}
        >
          Print Report
        </Button>
      </div>

      {/* Period Selection Controls */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === p.value
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="flex items-center space-x-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
            />
            <Button size="sm" onClick={fetchAnalytics}>
              Apply
            </Button>
          </div>
        )}
      </div>

      {/* KPI Cards for Chosen Period */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Period Income"
            amount={summary?.totalIncome || 0}
            icon={<HiOutlineArrowTrendingUp className="w-6 h-6" />}
            iconBgColor="bg-emerald-500/10 text-emerald-500"
            subtitle={`${summary?.incomeCount || 0} deposits`}
          />

          <StatCard
            title="Period Expenses"
            amount={summary?.totalExpenses || 0}
            icon={<HiOutlineArrowTrendingDown className="w-6 h-6" />}
            iconBgColor="bg-rose-500/10 text-rose-500"
            subtitle={`${summary?.expenseCount || 0} expenses`}
          />

          <StatCard
            title="Net Savings"
            amount={summary?.totalBalance || 0}
            icon={<HiOutlineScale className="w-6 h-6" />}
            iconBgColor="bg-brand-500/10 text-brand-500"
            subtitle={`Savings Rate: ${summary?.savingsRate || 0}%`}
          />

          <StatCard
            title="Top Spending Category"
            amount={summary?.highestSpendingCategory?.category || 'None'}
            isCurrency={false}
            icon={<HiOutlineSparkles className="w-6 h-6" />}
            iconBgColor="bg-purple-500/10 text-purple-500"
            subtitle={
              summary?.highestSpendingCategory?.amount
                ? `Total: ${formatCurrency(summary.highestSpendingCategory.amount)}`
                : 'No expenses'
            }
          />
        </div>
      )}

      {/* Dynamic Spending Insights Panel */}
      {insights && insights.insights && insights.insights.length > 0 && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Smart Financial Insights
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily averages and spending health observations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Daily Average Spend (This Month)
              </span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {formatCurrency(insights.dailyAverage)}
                <span className="text-xs font-normal text-slate-400 ml-1">/ day</span>
              </p>
            </div>

            {insights.insights.map((insight, idx) => {
              const iconColor =
                insight.type === 'danger'
                  ? 'text-rose-500 bg-rose-500/10'
                  : insight.type === 'warning'
                  ? 'text-amber-500 bg-amber-500/10'
                  : insight.type === 'success'
                  ? 'text-emerald-500 bg-emerald-500/10'
                  : 'text-brand-500 bg-brand-500/10';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`p-1 rounded-md ${iconColor}`}>
                      {insight.type === 'danger' || insight.type === 'warning' ? (
                        <HiOutlineExclamationTriangle className="w-4 h-4" />
                      ) : (
                        <HiOutlineCheckCircle className="w-4 h-4" />
                      )}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {insight.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>
          <div>
            <SkeletonChart />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IncomeVsExpenseChart data={monthlyData} />
          </div>
          <div>
            <CategoryPieChart
              data={categoryData}
              totalExpense={categoryTotal}
              title="Category Spending Distribution"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
