import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { HiOutlineSparkles, HiOutlineHome } from 'react-icons/hi2';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6 animate-slide-up">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center text-2xl font-extrabold shadow-glow">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div>
          <Link to="/">
            <Button variant="primary" icon={<HiOutlineHome className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
