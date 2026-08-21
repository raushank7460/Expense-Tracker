import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/common/Logo';
import Footer from '../components/layout/Footer';
import {
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
  HiOutlineChartPie,
  HiOutlineShieldCheck,
  HiOutlineDocumentArrowDown,
  HiOutlineArrowsRightLeft,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from 'react-icons/hi2';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 glass-header px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" to="/" />

          {/* Nav links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-500 transition-colors">
              Features
            </a>
            <a href="#analytics" className="hover:text-brand-500 transition-colors">
              Analytics
            </a>
            <a href="#budgets" className="hover:text-brand-500 transition-colors">
              Budgets
            </a>
            <a href="#testimonials" className="hover:text-brand-500 transition-colors">
              Reviews
            </a>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? (
                <HiOutlineSun className="w-5 h-5 text-amber-400" />
              ) : (
                <HiOutlineMoon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-glow transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Subtle glowing backdrop orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <HiOutlineSparkles className="w-4 h-4" />
            <span>Next-Generation Personal Finance SaaS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto leading-[1.1]">
            Master Your Money with <span className="gradient-text">Precision & Clarity.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Track daily expenses, record multiple income streams, establish category budgets, and
            unlock deep financial analytics with zero spreadsheet hassle.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Start Tracking for Free</span>
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Value props ribbon */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-2">
              <HiOutlineCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Privacy Isolated</span>
            </span>
            <span className="flex items-center space-x-2">
              <HiOutlineCheck className="w-4 h-4 text-emerald-500" />
              <span>Real-Time Budget Warnings</span>
            </span>
            <span className="flex items-center space-x-2">
              <HiOutlineCheck className="w-4 h-4 text-emerald-500" />
              <span>One-Click CSV Export</span>
            </span>
            <span className="flex items-center space-x-2">
              <HiOutlineCheck className="w-4 h-4 text-emerald-500" />
              <span>Multi-Currency Support</span>
            </span>
          </div>

          {/* Interactive UI Mockup Showcase */}
          <div className="mt-16 relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-slate-200/50 to-slate-100/20 dark:from-slate-800/60 dark:to-slate-900/40 border border-slate-200/80 dark:border-slate-700/80 shadow-2xl max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-6 text-left overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-bold text-slate-400">SpendFlow SaaS Dashboard</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Live Preview
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Total Income</span>
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-500 mt-1 font-heading">₹75,000</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Total Expenses</span>
                  <p className="text-xl sm:text-2xl font-extrabold text-rose-500 mt-1 font-heading">₹28,450</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Net Balance</span>
                  <p className="text-xl sm:text-2xl font-extrabold text-brand-500 mt-1 font-heading">₹46,550</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Savings Rate</span>
                  <p className="text-xl sm:text-2xl font-extrabold text-purple-500 mt-1 font-heading">62%</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Interactive financial reports ready for your custom entries</span>
                </span>
                <Link to="/register" className="text-brand-500 font-bold hover:underline">
                  Create your ledger →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 sm:py-28 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-[#0E131F]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
              Comprehensive Toolkit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading mt-2">
              Everything You Need to Build Lasting Financial Health
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base">
              Built using standard MERN architecture with high-security JWT token isolation and clean RESTful design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
                <HiOutlineArrowsRightLeft className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Unified Ledger System
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Log both incoming earnings and outgoing expenses in one harmonized ledger with instant search, category filtering, and payment method tags.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                <HiOutlineChartPie className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Category-Wise Smart Budgets
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Set monthly limits for Food, Shopping, Bills, and custom categories. Receive immediate visual warnings when approaching or surpassing thresholds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <HiOutlineArrowTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Interactive Analytics with Recharts
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Visualize income vs expenses, rolling 12-month savings trajectories, and category donut distributions with smooth interactive tooltips.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <HiOutlineDocumentArrowDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Instant CSV & Print Reports
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Export your entire financial history with one click into standard CSV spreadsheets or generate print-ready clean financial statements.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <HiOutlineShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Secure JWT & Data Isolation
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Every user's records are strictly isolated at the database level with salted bcrypt password hashing and token-based API verification.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
                <HiOutlineSparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Custom Categories & Currencies
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Define your own categories with custom icons and color palettes. Seamlessly switch between ₹ INR, $ USD, € EUR, £ GBP, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section id="testimonials" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
              User Stories
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-2">
              Loved by Freelancers, Professionals & Families
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "SpendFlow replaced my messy Excel sheets. The category budget progress bars give me an instant heads-up before I overspend on dining out."
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-500 font-bold flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ananya Kapoor</p>
                  <p className="text-[11px] text-slate-400">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "Being able to track freelance income against project expenses in a unified transaction table with CSV export makes tax time a breeze."
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-xs">
                  RS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Rohan Sharma</p>
                  <p className="text-[11px] text-slate-400">Freelance Designer</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "The Recharts visualizations and dark mode are gorgeous. Clean, responsive, and blazing fast on both my phone and desktop."
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-500 font-bold flex items-center justify-center text-xs">
                  PV
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Priya Verma</p>
                  <p className="text-[11px] text-slate-400">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
                Ready to Take Total Control of Your Finances?
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 font-normal">
                Join now and experience modern, stress-free money management.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold hover:bg-slate-100 shadow-xl hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
                >
                  <span>Create Free Account</span>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
