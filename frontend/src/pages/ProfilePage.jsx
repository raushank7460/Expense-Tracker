import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';

import Button from '../components/common/Button';
import Input from '../components/common/Input';

import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineCheck,
} from 'react-icons/hi2';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { currencyCode, setCurrency, currencies } = useCurrency();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setProfileLoading(true);
    const res = await updateProfile({ name: name.trim(), profileImage, currency: currencyCode });
    setProfileLoading(false);

    if (res.success) {
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmNewPassword) errors.confirmNewPassword = 'Passwords do not match';

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPasswordLoading(true);
    const res = await changePassword({ currentPassword, newPassword, confirmNewPassword });
    setPasswordLoading(false);

    if (res.success) {
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordErrors({});
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal details, security settings, and app preferences
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <div className="relative group">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-glow">
              {name ? name[0].toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            {user?.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start space-x-1.5">
            <HiOutlineEnvelope className="w-4 h-4" />
            <span>{user?.email}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              <span>Joined: {formatDate(user?.createdAt)}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
              <HiOutlineCheck className="w-3.5 h-3.5" />
              <span>Verified Account</span>
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile & Avatar Selection Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Personal Information
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update your public display name and avatar photo
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<HiOutlineUser className="w-4 h-4" />}
            required
          />

          <div className="space-y-2">
            <Input
              label="Profile Avatar URL (Optional)"
              placeholder="https://example.com/avatar.jpg"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />

            {/* Quick Preset Avatars */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Or choose a preset avatar:
              </span>
              <div className="flex items-center space-x-3">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfileImage(url)}
                    className={`w-10 h-10 rounded-xl overflow-hidden ring-2 transition-transform ${
                      profileImage === url
                        ? 'ring-brand-500 scale-110'
                        : 'ring-transparent opacity-75 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" isLoading={profileLoading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Global Preferences (Currency & Theme) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize currency display and visual appearance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Currency Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
              <HiOutlineCurrencyDollar className="w-4 h-4 mr-1.5 text-slate-400" />
              Primary Currency
            </label>
            <select
              value={currencyCode}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {Object.keys(currencies).map((code) => (
                <option key={code} value={code}>
                  {currencies[code].name} ({currencies[code].symbol})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              All transactions and budgets will display with this currency symbol.
            </p>
          </div>

          {/* Theme Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
              {isDark ? (
                <HiOutlineMoon className="w-4 h-4 mr-1.5 text-amber-400" />
              ) : (
                <HiOutlineSun className="w-4 h-4 mr-1.5 text-slate-400" />
              )}
              Appearance Theme
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-500 transition-colors flex items-center justify-center space-x-2"
              >
                <span>{isDark ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Toggle between Dark and Light color palettes.</p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Security & Password
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ensure your account is using a secure, strong password
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={<HiOutlineLockClosed className="w-4 h-4" />}
            error={passwordErrors.currentPassword}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<HiOutlineKey className="w-4 h-4" />}
              error={passwordErrors.newPassword}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              icon={<HiOutlineKey className="w-4 h-4" />}
              error={passwordErrors.confirmNewPassword}
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="secondary" isLoading={passwordLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
