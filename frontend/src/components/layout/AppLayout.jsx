import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ExpenseModal from '../expenses/ExpenseModal';
import IncomeModal from '../income/IncomeModal';
import { expenseService } from '../../services/expenseService';
import { incomeService } from '../../services/incomeService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateExpense = async (data) => {
    setActionLoading(true);
    try {
      const res = await expenseService.createExpense(data);
      if (res.success) {
        showToast('Expense recorded successfully!', 'success');
        setIsExpenseModalOpen(false);
        // Dispatch event so active page can refresh its data
        window.dispatchEvent(new CustomEvent('spendflow:refresh'));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateIncome = async (data) => {
    setActionLoading(true);
    try {
      const res = await incomeService.createIncome(data);
      if (res.success) {
        showToast('Income recorded successfully!', 'success');
        setIsIncomeModalOpen(false);
        window.dispatchEvent(new CustomEvent('spendflow:refresh'));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to record income', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onQuickAddExpense={() => setIsExpenseModalOpen(true)}
        onQuickAddIncome={() => setIsIncomeModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleCreateExpense}
        categories={categories}
        isLoading={actionLoading}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={handleCreateIncome}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AppLayout;
