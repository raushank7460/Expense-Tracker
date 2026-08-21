import React, { createContext, useContext, useState, useCallback } from 'react';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX, HiExclamation } from 'react-icons/hi';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success', duration = 3500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-600 text-white border-emerald-700 shadow-glow-emerald',
            error: 'bg-rose-600 text-white border-rose-700 shadow-glow-rose',
            warning: 'bg-amber-600 text-white border-amber-700 shadow-amber-500/20',
            info: 'bg-brand-600 text-white border-brand-700 shadow-glow',
          };

          const icons = {
            success: <HiCheckCircle className="w-5 h-5 shrink-0" />,
            error: <HiExclamationCircle className="w-5 h-5 shrink-0" />,
            warning: <HiExclamation className="w-5 h-5 shrink-0" />,
            info: <HiInformationCircle className="w-5 h-5 shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium animate-slide-up transition-all ${
                typeStyles[toast.type] || typeStyles.info
              }`}
            >
              <div className="flex items-center space-x-3">
                {icons[toast.type] || icons.info}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2 shrink-0"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
