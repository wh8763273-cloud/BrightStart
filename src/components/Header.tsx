import React, { useState } from 'react';
import { AppUser, Announcement } from '../types';

interface HeaderProps {
  user: AppUser | null;
  onOpenAuthModal: () => void;
  announcements: Announcement[];
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenAuthModal, announcements }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md flex justify-between items-center h-16 px-4 max-w-xl mx-auto left-0 right-0 border-b border-slate-200">
      <div className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none">BrightStart</h1>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Primary School</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* User Auth Chip */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/70 transition-colors text-xs font-semibold text-indigo-700 active:scale-95"
          title="Account / Login"
        >
          <span className="material-symbols-outlined text-sm text-indigo-600">account_circle</span>
          <span className="max-w-[100px] truncate">{user ? user.displayName.split(' ')[0] : 'Sign In'}</span>
        </button>

        {/* Notifications Icon & Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors active:scale-95 relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-indigo-600">campaign</span>
                  School Announcements
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No new announcements today.</p>
                ) : (
                  announcements.map((ann) => (
                    <div key={ann.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-xs text-slate-800">{ann.title}</span>
                        <span className="text-[10px] text-slate-400">{ann.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
