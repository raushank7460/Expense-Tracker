import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import {
  HiOutlineSquares2X2,
  HiOutlineArrowsRightLeft,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineChartPie,
  HiOutlineTag,
  HiOutlineChartBarSquare,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
} from 'react-icons/hi2';

export const Sidebar = ({ isOpen, onClose, onQuickAddExpense, onQuickAddIncome }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <HiOutlineSquares2X2 className="w-5 h-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <HiOutlineArrowsRightLeft className="w-5 h-5" /> },
    { name: 'Expenses', path: '/expenses', icon: <HiOutlineArrowTrendingDown className="w-5 h-5 text-rose-500" /> },
    { name: 'Income', path: '/income', icon: <HiOutlineArrowTrendingUp className="w-5 h-5 text-emerald-500" /> },
    { name: 'Budgets', path: '/budgets', icon: <HiOutlineChartPie className="w-5 h-5" /> },
    { name: 'Categories', path: '/categories', icon: <HiOutlineTag className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <HiOutlineChartBarSquare className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <HiOutlineUser className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0E131F] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
            <Logo size="md" to="/dashboard" subtitle="Pro Finance" />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="px-4 py-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (onQuickAddExpense) onQuickAddExpense();
                if (onClose) onClose();
              }}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>+ Expense</span>
            </button>
            <button
              onClick={() => {
                if (onQuickAddIncome) onQuickAddIncome();
                if (onClose) onClose();
              }}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>+ Income</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User info & Signout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Sign Out"
            >
              <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
