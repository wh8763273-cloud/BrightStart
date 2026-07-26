import React, { useState } from 'react';
import { loginAsDemoUser, logoutUser } from '../lib/authService';
import { AppUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  onUserChanged: (user: AppUser | null) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserChanged,
  showToast
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = async (role: 'Principal' | 'Teacher') => {
    try {
      setLoading(true);
      const appUser = await loginAsDemoUser(role);
      onUserChanged(appUser);
      showToast(`Signed in as ${appUser.displayName} (${role})`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onUserChanged(null);
      showToast('Signed out successfully', 'info');
      onClose();
    } catch (err) {
      showToast('Error signing out', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 text-indigo-600">
          <span className="material-symbols-outlined text-2xl">verified_user</span>
        </div>

        <h2 className="font-bold text-lg text-slate-900 mb-1">
          {user ? 'Account Session' : 'Welcome to BrightStart'}
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          {user
            ? `Signed in as ${user.displayName} (${user.role})`
            : 'Select a demo account to instantly authenticate with Firebase'}
        </p>

        {user ? (
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs text-slate-700 space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>UID:</strong> <span className="font-mono text-[10px] text-slate-500">{user.uid}</span></p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <button
              onClick={() => handleDemoLogin('Principal')}
              disabled={loading}
              className="w-full py-3 px-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">local_police</span>
                <div className="text-left">
                  <p className="font-bold leading-tight">Principal Sarah Miller</p>
                  <p className="text-[10px] text-indigo-100 font-normal">Full School Administrator Access</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>

            <button
              onClick={() => handleDemoLogin('Teacher')}
              disabled={loading}
              className="w-full py-3 px-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs hover:bg-emerald-100 transition-all shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg text-emerald-700">school</span>
                <div className="text-left">
                  <p className="font-bold leading-tight text-emerald-900">Teacher Alex</p>
                  <p className="text-[10px] text-emerald-700 font-normal">Class Teacher & Attendance Access</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm text-emerald-700 group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
