import React, { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { categoryService } from '../services/categoryService';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate, getCategoryColor } from '../utils/formatters';
import { exportToCSV, printFinancialReport } from '../utils/exportUtils';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ExpenseModal from '../components/expenses/ExpenseModal';
import IncomeModal from '../components/income/IncomeModal';
import CategoryIcon from '../components/common/CategoryIcon';
import { SkeletonTable } from '../components/common/SkeletonLoader';

import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray,
  HiOutlinePrinter,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineFunnel,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from 'react-icons/hi2';

export const TransactionsPage = () => {
  const { formatCurrency } = useCurrency();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const debouncedSearch = useDebounce(search, 350);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, type, title }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState(null);
  const [editIncomeData, setEditIncomeData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 10,
          search: debouncedSearch,
          type,
          category,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortBy,
        };

        const res = await transactionService.getTransactions(params);
        if (res.success) {
          setTransactions(res.data);
          setPagination(res.pagination);
          setSummary(res.summary);
        }
      } catch (err) {
        showToast('Failed to load transactions', 'error');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, type, category, startDate, endDate, sortBy, showToast]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  const handleExportCSV = async () => {
    try {
      showToast('Preparing CSV export...', 'info');
      const res = await transactionService.exportTransactions();
      if (res.success && res.data) {
        exportToCSV(res.data, `spendflow_ledger_${new Date().toISOString().split('T')[0]}.csv`);
        showToast('CSV downloaded successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to export transactions', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === 'expense') {
        await expenseService.deleteExpense(deleteTarget._id);
      } else {
        await incomeService.deleteIncome(deleteTarget._id);
      }
      showToast('Transaction deleted successfully', 'success');
      setDeleteTarget(null);
      fetchTransactions(pagination.page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete transaction', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateExpense = async (data) => {
    if (!editExpenseData) return;
    setActionLoading(true);
    try {
      const res = await expenseService.updateExpense(editExpenseData._id, data);
      if (res.success) {
        showToast('Expense updated successfully!', 'success');
        setEditExpenseData(null);
        fetchTransactions(pagination.page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateIncome = async (data) => {
    if (!editIncomeData) return;
    setActionLoading(true);
    try {
      const res = await incomeService.updateIncome(editIncomeData._id, data);
      if (res.success) {
        showToast('Income updated successfully!', 'success');
        setEditIncomeData(null);
        fetchTransactions(pagination.page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update income', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Transactions Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Unified record of all incoming earnings and outgoing expenditures
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={printFinancialReport}
            icon={<HiOutlinePrinter className="w-4 h-4" />}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            icon={<HiOutlineArrowDownTray className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Mini Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Filtered Income
            </span>
            <p className="text-xl font-extrabold text-emerald-500 font-heading mt-0.5">
              +{formatCurrency(summary.totalIncome)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <HiOutlineArrowTrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Filtered Expenses
            </span>
            <p className="text-xl font-extrabold text-rose-500 font-heading mt-0.5">
              -{formatCurrency(summary.totalExpense)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
            <HiOutlineArrowTrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Filtered Net Flow
            </span>
            <p
              className={`text-xl font-extrabold font-heading mt-0.5 ${
                summary.netBalance >= 0 ? 'text-brand-500' : 'text-rose-500'
              }`}
            >
              {formatCurrency(summary.netBalance)}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            {pagination.total} Records
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by title, source or memo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<HiOutlineMagnifyingGlass className="w-4 h-4" />}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
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
          {(startDate || endDate || search || type !== 'all' || category !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setType('all');
                setCategory('All');
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

      {/* Transactions Table View */}
      {loading ? (
        <SkeletonTable rows={8} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No Transactions Found"
          subtitle="No records match your selected filter criteria. Try adjusting your search."
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Type</th>
                  <th className="py-3.5 px-4">Title / Source</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {transactions.map((t) => {
                  const isIncome = t.type === 'income';
                  return (
                    <tr
                      key={t._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Type Badge */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge variant={isIncome ? 'success' : 'danger'}>
                          {isIncome ? '+ Income' : '- Expense'}
                        </Badge>
                      </td>

                      {/* Title / Source */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                          {t.title}
                        </div>
                        {t.description && (
                          <div className="text-[11px] text-slate-400 max-w-xs truncate">
                            {t.description}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: isIncome ? '#10b981' : getCategoryColor(t.category),
                            }}
                          />
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {t.category}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                          {t.paymentMethod || 'Direct'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              if (isIncome) {
                                setEditIncomeData({
                                  _id: t._id,
                                  source: t.title,
                                  amount: t.amount,
                                  date: t.date,
                                  description: t.description,
                                });
                              } else {
                                setEditExpenseData({
                                  _id: t._id,
                                  title: t.title,
                                  amount: t.amount,
                                  category: t.category,
                                  date: t.date,
                                  paymentMethod: t.paymentMethod,
                                  description: t.description,
                                });
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit transaction"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                _id: t._id,
                                type: t.type,
                                title: t.title,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete transaction"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(p) => fetchTransactions(p)}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction?"
        message={`Are you sure you want to remove '${deleteTarget?.title}'? This action cannot be undone.`}
        isLoading={deleteLoading}
      />

      {/* Edit Expense Modal */}
      <ExpenseModal
        isOpen={!!editExpenseData}
        onClose={() => setEditExpenseData(null)}
        onSubmit={handleUpdateExpense}
        initialData={editExpenseData}
        categories={categories}
        isLoading={actionLoading}
      />

      {/* Edit Income Modal */}
      <IncomeModal
        isOpen={!!editIncomeData}
        onClose={() => setEditIncomeData(null)}
        onSubmit={handleUpdateIncome}
        initialData={editIncomeData}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default TransactionsPage;
