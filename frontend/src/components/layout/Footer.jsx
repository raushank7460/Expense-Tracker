import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaFacebookF,
} from 'react-icons/fa6';
import {
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineLockClosed,
  HiOutlineEnvelope,
} from 'react-icons/hi2';

// =========================================================================
// 🔗 SOCIAL MEDIA LINKS - PASTE YOUR PROFILE LINKS HERE:
// =========================================================================
export const SOCIAL_LINKS = {
  github: 'https://github.com/raushank7460', // <-- Paste your GitHub URL here
  linkedin: 'https://www.linkedin.com/in/raushan-kumar-449969421/', // <-- Paste your LinkedIn URL here
  instagram: 'https://www.instagram.com/raushanyadav_6', // <-- Paste your Instagram URL here
  twitter: 'https://x.com/your-username', // <-- Paste your X (Twitter) URL here
  facebook: 'https://www.facebook.com/share/18MzWh2Gd6/', // <-- Paste your Facebook URL here
  
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialButtons = [
    {
      name: 'GitHub',
      url: SOCIAL_LINKS.github,
      icon: <FaGithub className="w-4 h-4" />,
      colorClass: 'hover:bg-slate-900 hover:text-white hover:border-slate-800 dark:hover:bg-slate-800',
    },
    {
      name: 'LinkedIn',
      url: SOCIAL_LINKS.linkedin,
      icon: <FaLinkedinIn className="w-4 h-4" />,
      colorClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
    },
    {
      name: 'Instagram',
      url: SOCIAL_LINKS.instagram,
      icon: <FaInstagram className="w-4 h-4" />,
      colorClass: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-rose-500',
    },
    {
      name: 'X (Twitter)',
      url: SOCIAL_LINKS.twitter,
      icon: <FaXTwitter className="w-4 h-4" />,
      colorClass: 'hover:bg-slate-900 hover:text-white hover:border-slate-800 dark:hover:bg-white dark:hover:text-black',
    },
    {
      name: 'Facebook',
      url: SOCIAL_LINKS.facebook,
      icon: <FaFacebookF className="w-4 h-4" />,
      colorClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
  ];

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0B0F19]/80 backdrop-blur-xl transition-colors duration-200 text-slate-600 dark:text-slate-400">
      {/* Upper Footer: Brand, Links, Socials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" subtitle="Smart Financial Platform" />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              SpendFlow is an intelligent personal finance and expense tracking suite designed to empower individuals with real-time budget insights, category analytics, and financial clarity.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[11px] font-semibold">
                <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                <HiOutlineLockClosed className="w-3.5 h-3.5" />
                <span>JWT Secure Auth</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Live Dashboard
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Expense Tracking
                </Link>
              </li>
              <li>
                <Link to="/budgets" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Monthly Budgets
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Visual Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect & Social Media */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Connect With Me
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Follow me on social networks and check out my open-source projects:
            </p>

            {/* Social Media Link Icons */}
            <div className="flex items-center flex-wrap gap-2.5 pt-1">
              {socialButtons.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${social.colorClass}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Quick Auth buttons */}
            <div className="pt-2 flex items-center space-x-2 text-xs">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 transition-colors"
              >
                Sign In
              </Link>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="border-t border-slate-100 dark:border-slate-800/60 py-5 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-slate-500 dark:text-slate-400">
            © {currentYear} <span className="font-semibold text-slate-700 dark:text-slate-200">SpendFlow</span>. All rights reserved.
          </p>

          <p className="inline-flex items-center justify-center space-x-1.5 text-slate-500 dark:text-slate-400">
            <span>Built with</span>
            <HiOutlineHeart className="w-4 h-4 text-rose-500 inline fill-rose-500" />
            <span>using React, Node.js, Express & MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
