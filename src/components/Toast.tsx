import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border flex items-center justify-between transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/40'
              : toast.type === 'error'
              ? 'bg-slate-900 text-white border-rose-500/40'
              : 'bg-slate-900 text-white border-indigo-500/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className={`material-symbols-outlined text-lg ${
              toast.type === 'success' ? 'text-emerald-400' : toast.type === 'error' ? 'text-rose-400' : 'text-indigo-400'
            }`}>
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <p className="text-xs font-medium text-slate-100">{toast.text}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
