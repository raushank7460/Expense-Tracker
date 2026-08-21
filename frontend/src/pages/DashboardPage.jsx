import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { analyticsService } from '../services/analyticsService';
import { budgetService } from '../services/budgetService';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { useToast } from '../context/ToastContext';

import StatCard from '../components/common/StatCard';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../components/common/SkeletonLoader';
import IncomeVsExpenseChart from '../components/dashboard/IncomeVsExpenseChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import BudgetProgressWidget from '../components/dashboard/BudgetProgressWidget';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpenseModal from '../components/expenses/ExpenseModal';
import IncomeModal from '../components/income/IncomeModal';

import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineScale,
  HiOutlineBanknotes,
  HiOutlineSparkles,
  HiOutlinePlus,
} from 'react-icons/hi2';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetMeta, setBudgetMeta] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modals state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        summaryRes,
        monthlyRes,
        categoryRes,
        budgetRes,
        transactionRes,
        catRes,
      ] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getMonthlyAnalytics(),
        analyticsService.getCategoryAnalytics({ period: 'this_month' }),
        budgetService.getBudgets(),
        transactionService.getTransactions({ limit: 5 }),
        categoryService.getCategories(),
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (monthlyRes.success) setMonthlyTrend(monthlyRes.data);
      if (categoryRes.success) setCategoryData(categoryRes.data);
      if (budgetRes.success) {
        setBudgets(budgetRes.data);
        setBudgetMeta(budgetRes.meta);
      }
      if (transactionRes.success) setRecentTransactions(transactionRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Listen for global data refresh event
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('spendflow:refresh', handleRefresh);
    return () => window.removeEventListener('spendflow:refresh', handleRefresh);
  }, [fetchDashboardData]);

  const handleAddExpense = async (data) => {
    setActionLoading(true);
    try {
      const res = await expenseService.createExpense(data);
      if (res.success) {
        showToast('Expense added successfully!', 'success');
        setExpenseModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddIncome = async (data) => {
    setActionLoading(true);
    try {
      const res = await incomeService.createIncome(data);
      if (res.success) {
        showToast('Income added successfully!', 'success');
        setIncomeModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add income', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, <span className="font-semibold text-brand-600 dark:text-brand-400">{user?.name}</span>! Here is your latest financial summary.
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIncomeModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald hover:scale-105 active:scale-95 transition-all"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Net Balance */}
          <StatCard
            title="Total Balance"
            amount={summary?.totalBalance || 0}
            icon={<HiOutlineScale className="w-6 h-6" />}
            iconBgColor="bg-brand-500/10 text-brand-600 dark:text-brand-400"
            subtitle={`${summary?.totalTransactions || 0} Total Transactions`}
          />

          {/* Total Income */}
          <StatCard
            title="Total Income"
            amount={summary?.totalIncome || 0}
            icon={<HiOutlineArrowTrendingUp className="w-6 h-6" />}
            iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            subtitle={`${summary?.incomeCount || 0} Income deposits`}
          />

          {/* Total Expenses */}
          <StatCard
            title="Total Expenses"
            amount={summary?.totalExpenses || 0}
            icon={<HiOutlineArrowTrendingDown className="w-6 h-6" />}
            iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
            subtitle={`${summary?.expenseCount || 0} Expenses logged`}
          />

          {/* Savings Rate / Net Worth */}
          <StatCard
            title="Savings Rate"
            amount={`${summary?.savingsRate || 0}%`}
            isCurrency={false}
            icon={<HiOutlineSparkles className="w-6 h-6" />}
            iconBgColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            subtitle={`Net Saved: ${formatCurrency(summary?.savings || 0)}`}
          />
        </div>
      )}

      {/* Charts Section: Monthly Trend & Category Donut */}
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
            <IncomeVsExpenseChart data={monthlyTrend} />
          </div>
          <div>
            <CategoryPieChart
              data={categoryData}
              totalExpense={summary?.totalExpenses || 0}
              title="Monthly Category Breakdown"
            />
          </div>
        </div>
      )}

      {/* Bottom Section: Budgets Status & Recent Transactions */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonTable />
          <SkeletonTable />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetProgressWidget budgets={budgets} meta={budgetMeta} />
          <RecentTransactions
            transactions={recentTransactions}
            onAddExpense={() => setExpenseModalOpen(true)}
            onAddIncome={() => setIncomeModalOpen(true)}
          />
        </div>
      )}

      {/* Action Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={handleAddExpense}
        categories={categories}
        isLoading={actionLoading}
      />

      <IncomeModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onSubmit={handleAddIncome}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default DashboardPage;
