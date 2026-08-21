import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  size = 'md',
  showText = true,
  to = '/',
  className = '',
  subtitle = null,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center space-x-2.5 group select-none ${className}`}>
      {/* Glowing Brand Icon with SVG */}
      <div
        className={`${currentSize.icon} rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-1.5 flex items-center justify-center text-white shadow-glow group-hover:scale-105 group-hover:shadow-brand-500/30 transition-all duration-300 relative overflow-hidden`}
      >
        {/* Shimmer backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white"
        >
          {/* Stylized Sparkle + Growth */}
          <path d="m12 3 2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3Z" fill="currentColor" fillOpacity="0.8" />
          <circle cx="18" cy="5" r="1.5" fill="#38BDF8" />
          <path d="M4 20c4-2 7-5 10-9" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-extrabold ${currentSize.text} font-heading tracking-tight text-slate-900 dark:text-white leading-none`}>
            Spend<span className="text-brand-500">Flow</span>
          </span>
          {subtitle && (
            <span className={`block ${currentSize.sub} uppercase font-bold tracking-widest text-brand-500 mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
