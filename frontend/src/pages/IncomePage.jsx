import React, { useState, useEffect, useCallback } from 'react';
import { incomeService } from '../services/incomeService';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../utils/formatters';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import IncomeModal from '../components/income/IncomeModal';
import { SkeletonTable } from '../components/common/SkeletonLoader';

import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineFunnel,
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
} from 'react-icons/hi2';

export const IncomePage = () => {
  const { formatCurrency } = useCurrency();
  const { showToast } = useToast();

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalAmount: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });

  // Filters
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const debouncedSearch = useDebounce(search, 350);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIncomes = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 10,
          search: debouncedSearch,
          source,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          sortBy,
        };

        const res = await incomeService.getIncomes(params);
        if (res.success) {
          setIncomes(res.data);
          setPagination(res.pagination);
          setSummary(res.summary);
        }
      } catch (err) {
        showToast('Failed to load income records', 'error');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, source, startDate, endDate, sortBy, showToast]
  );

  useEffect(() => {
    fetchIncomes(1);
  }, [fetchIncomes]);

  const handleSaveIncome = async (data) => {
    setActionLoading(true);
    try {
      if (editingIncome) {
        const res = await incomeService.updateIncome(editingIncome._id, data);
        if (res.success) {
          showToast('Income updated successfully!', 'success');
          setEditingIncome(null);
          setIsModalOpen(false);
          fetchIncomes(pagination.page);
        }
      } else {
        const res = await incomeService.createIncome(data);
        if (res.success) {
          showToast('Income recorded successfully!', 'success');
          setIsModalOpen(false);
          fetchIncomes(1);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save income', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await incomeService.deleteIncome(deleteTarget._id);
      if (res.success) {
        showToast('Income record deleted successfully', 'success');
        setDeleteTarget(null);
        fetchIncomes(pagination.page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete income', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const commonSources = ['All', 'Salary', 'Freelancing', 'Business', 'Investment', 'Dividends', 'Gift', 'Rental', 'Other'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Income Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Log and manage your salaries, freelance earnings, investments, and revenue streams
          </p>
        </div>

        <Button
          variant="success"
          onClick={() => {
            setEditingIncome(null);
            setIsModalOpen(true);
          }}
          icon={<HiOutlinePlus className="w-4 h-4" />}
        >
          Record New Income
        </Button>
      </div>

      {/* Summary KPI Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Earnings Recorded
            </span>
            <p className="text-2xl font-extrabold text-emerald-500 font-heading mt-0.5">
              +{formatCurrency(summary.totalAmount)}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {pagination.total} Deposits
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by source or memo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<HiOutlineMagnifyingGlass className="w-4 h-4" />}
            />
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {commonSources.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Income Sources' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Date Range Filter */}
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
          {(startDate || endDate || search || source !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSource('All');
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

      {/* Income Table */}
      {loading ? (
        <SkeletonTable rows={6} />
      ) : incomes.length === 0 ? (
        <EmptyState
          title="No Income Logged"
          subtitle="You haven't recorded any income entries yet. Record your salary or client payment now!"
          actionLabel="+ Record Income"
          onAction={() => {
            setEditingIncome(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Source</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Date Received</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {incomes.map((inc) => (
                  <tr
                    key={inc._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <HiOutlineArrowTrendingUp className="w-4 h-4" />
                        </div>
                        <span>{inc.source}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {inc.description || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(inc.date)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      +{formatCurrency(inc.amount)}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setEditingIncome(inc);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit income"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete income"
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
              onPageChange={(p) => fetchIncomes(p)}
            />
          </div>
        </div>
      )}

      {/* Income Modal */}
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIncome(null);
        }}
        onSubmit={handleSaveIncome}
        initialData={editingIncome}
        isLoading={actionLoading}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Income Record?"
        message={`Are you sure you want to delete '${deleteTarget?.source}' (${formatCurrency(
          deleteTarget?.amount || 0
        )})?`}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default IncomePage;
