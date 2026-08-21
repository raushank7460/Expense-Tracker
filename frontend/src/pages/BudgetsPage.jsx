import React, { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { getCategoryColor } from '../utils/formatters';

import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BudgetModal from '../components/budgets/BudgetModal';
import CategoryIcon from '../components/common/CategoryIcon';
import { SkeletonCard } from '../components/common/SkeletonLoader';

import {
  HiOutlinePlus,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineChartPie,
} from 'react-icons/hi2';

export const BudgetsPage = () => {
  const { formatCurrency } = useCurrency();
  const { showToast } = useToast();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgets({
        month: selectedMonth,
        year: selectedYear,
      });
      if (res.success) {
        setBudgets(res.data);
        setMeta(res.meta);
      }
    } catch (err) {
      showToast('Failed to load budgets', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, showToast]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSaveBudget = async (data) => {
    setActionLoading(true);
    try {
      if (editingBudget) {
        const res = await budgetService.updateBudget(editingBudget._id, data);
        if (res.success) {
          showToast('Budget updated successfully!', 'success');
          setIsModalOpen(false);
          setEditingBudget(null);
          fetchBudgets();
        }
      } else {
        const res = await budgetService.setBudget(data);
        if (res.success) {
          showToast('Budget established successfully!', 'success');
          setIsModalOpen(false);
          fetchBudgets();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save budget', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await budgetService.deleteBudget(deleteTarget._id);
      if (res.success) {
        showToast('Budget removed successfully', 'success');
        setDeleteTarget(null);
        fetchBudgets();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete budget', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Month/Year Pickers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Monthly Budgets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set category spending targets and avoid overspending
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Dropdown */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            icon={<HiOutlinePlus className="w-4 h-4" />}
          >
            Set Category Budget
          </Button>
        </div>
      </div>

      {/* Top Level Month Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Budget Limit
          </span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
            {formatCurrency(meta?.totalBudget || 0)}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Spent This Month
          </span>
          <p className="text-xl font-extrabold text-rose-500 font-heading mt-1">
            {formatCurrency(meta?.totalSpent || 0)}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Remaining Budget
          </span>
          <p
            className={`text-xl font-extrabold font-heading mt-1 ${
              (meta?.totalRemaining || 0) < 0 ? 'text-rose-500' : 'text-emerald-500'
            }`}
          >
            {formatCurrency(meta?.totalRemaining || 0)}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Overall Utilization
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xl font-extrabold text-brand-500 font-heading">
              {meta?.overallPercentage || 0}%
            </p>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  (meta?.overallPercentage || 0) >= 100
                    ? 'bg-rose-500'
                    : (meta?.overallPercentage || 0) >= 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(meta?.overallPercentage || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No Budgets Defined For This Month"
          subtitle={`You haven't set any category budgets for ${
            months[selectedMonth - 1]?.label
          } ${selectedYear}. Set one now to track your spending!`}
          actionLabel="+ Create Monthly Budget"
          onAction={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const isExceeded = b.percentage >= 100;
            const isWarning = b.percentage >= 75 && b.percentage < 100;

            let badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            let barColor = 'bg-emerald-500';
            let statusText = 'Safe';

            if (isExceeded) {
              badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
              barColor = 'bg-rose-500';
              statusText = 'Limit Exceeded';
            } else if (isWarning) {
              badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
              barColor = 'bg-amber-500';
              statusText = 'Approaching Limit';
            }

            return (
              <div
                key={b._id}
                className="glass-card rounded-2xl p-5 sm:p-6 space-y-4 hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: `${getCategoryColor(b.category)}15`,
                          color: getCategoryColor(b.category),
                        }}
                      >
                        <CategoryIcon icon={b.category} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white font-heading">
                          {b.category}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Target: {formatCurrency(b.amount)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                    >
                      {statusText}
                    </span>
                  </div>

                  {/* Progress Bar & Numerical Metrics */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Spent: <strong className="text-slate-900 dark:text-white">{formatCurrency(b.spent)}</strong></span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{b.percentage}%</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(b.percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">
                        {isExceeded ? 'Overspent by:' : 'Remaining:'}
                      </span>
                      <span
                        className={`font-bold ${
                          isExceeded ? 'text-rose-500' : 'text-emerald-500'
                        }`}
                      >
                        {formatCurrency(Math.abs(b.remaining))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingBudget(b);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit budget"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(b)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete budget"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSaveBudget}
        initialData={editingBudget}
        categories={categories}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Category Budget?"
        message={`Are you sure you want to remove the '${deleteTarget?.category}' budget limit for ${
          months[selectedMonth - 1]?.label
        }?`}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default BudgetsPage;
