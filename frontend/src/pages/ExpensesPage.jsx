import React, { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate, getCategoryColor } from '../utils/formatters';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ExpenseModal from '../components/expenses/ExpenseModal';
import CategoryIcon from '../components/common/CategoryIcon';
import { SkeletonTable } from '../components/common/SkeletonLoader';

import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineFunnel,
  HiOutlineCreditCard,
  HiOutlineTag,
} from 'react-icons/hi2';

export const ExpensesPage = () => {
  const { formatCurrency } = useCurrency();
  const { showToast } = useToast();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalAmount: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const debouncedSearch = useDebounce(search, 350);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
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

  const fetchExpenses = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 10,
          search: debouncedSearch,
          category,
          paymentMethod,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortBy,
        };

        const res = await expenseService.getExpenses(params);
        if (res.success) {
          setExpenses(res.data);
          setPagination(res.pagination);
          setSummary(res.summary);
        }
      } catch (err) {
        showToast('Failed to load expenses', 'error');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, category, paymentMethod, startDate, endDate, sortBy, showToast]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses(1);
  }, [fetchExpenses]);

  const handleSaveExpense = async (data) => {
    setActionLoading(true);
    try {
      if (editingExpense) {
        const res = await expenseService.updateExpense(editingExpense._id, data);
        if (res.success) {
          showToast('Expense updated successfully!', 'success');
          setEditingExpense(null);
          setIsModalOpen(false);
          fetchExpenses(pagination.page);
        }
      } else {
        const res = await expenseService.createExpense(data);
        if (res.success) {
          showToast('Expense created successfully!', 'success');
          setIsModalOpen(false);
          fetchExpenses(1);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await expenseService.deleteExpense(deleteTarget._id);
      if (res.success) {
        showToast('Expense deleted successfully', 'success');
        setDeleteTarget(null);
        fetchExpenses(pagination.page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Expense Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log, categorize, and control your daily expenditures
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          icon={<HiOutlinePlus className="w-4 h-4" />}
        >
          Add New Expense
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Expenses
            </span>
            <p className="text-2xl font-extrabold text-rose-500 font-heading mt-0.5">
              {formatCurrency(summary.totalAmount)}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500">
            {pagination.total} logged
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search expenses by title or memo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<HiOutlineMagnifyingGlass className="w-4 h-4" />}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Payment Methods</option>
              {paymentMethods.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Date Range Sub-Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500 flex items-center">
            <HiOutlineFunnel className="w-3.5 h-3.5 mr-1" /> Date Range:
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200"
            />
          </div>
          {(startDate || endDate || search || category !== 'All' || paymentMethod !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setPaymentMethod('All');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-rose-500 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      {loading ? (
        <SkeletonTable rows={7} />
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No Expenses Logged"
          subtitle="You haven't recorded any expenses matching your filters. Add one now!"
          actionLabel="+ Add First Expense"
          onAction={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {exp.title}
                      </div>
                      {exp.description && (
                        <div className="text-[11px] text-slate-400 max-w-xs truncate">
                          {exp.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: `${getCategoryColor(exp.category)}15`,
                            color: getCategoryColor(exp.category),
                          }}
                        >
                          <CategoryIcon icon={exp.category} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {exp.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(exp.date)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                        {exp.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(exp.amount)}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingExpense(exp);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit expense"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete expense"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(p) => fetchExpenses(p)}
            />
          </div>
        </div>
      )}

      {/* Expense Modal for Add/Edit */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSaveExpense}
        initialData={editingExpense}
        categories={categories}
        isLoading={actionLoading}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record?"
        message={`Are you sure you want to delete '${deleteTarget?.title}' (${formatCurrency(
          deleteTarget?.amount || 0
        )})?`}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default ExpensesPage;
