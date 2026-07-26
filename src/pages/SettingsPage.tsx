import React, { useState } from 'react';
import { SchoolProfile, AppUser } from '../types';
import { seedInitialDataIfEmpty } from '../lib/firestoreService';

interface SettingsPageProps {
  schoolProfile: SchoolProfile;
  user: AppUser | null;
  onOpenEditProfile: () => void;
  onOpenAuthModal: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  schoolProfile,
  user,
  onOpenEditProfile,
  onOpenAuthModal,
  showToast
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      showToast('Dark mode enabled', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      showToast('Light mode enabled', 'info');
    }
  };

  const handleReseed = async () => {
    if (confirm('Re-seed initial demo dataset to Firestore?')) {
      await seedInitialDataIfEmpty();
      showToast('Firestore dataset restored!', 'success');
    }
  };

  return (
    <div className="pt-20 pb-32 px-4 max-w-xl mx-auto min-h-screen space-y-5">
      {/* Profile Bento Card */}
      <section className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative h-28 bg-indigo-600">
          <img
            src={schoolProfile.coverUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000'}
            alt="School cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute -bottom-7 left-5 p-1 bg-white rounded-xl shadow-md border border-slate-100">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-indigo-600">school</span>
            </div>
          </div>
        </div>

        <div className="pt-9 pb-5 px-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                {schoolProfile.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">{schoolProfile.district}</p>
            </div>
            <button
              onClick={onOpenEditProfile}
              className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all hover:bg-indigo-100 border border-indigo-200/50"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                <span className="material-symbols-outlined text-base">person</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Principal</p>
                <p className="font-semibold text-slate-800">{schoolProfile.principal}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                <span className="material-symbols-outlined text-base">call</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Phone</p>
                <p className="font-semibold text-slate-800">{schoolProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                <span className="material-symbols-outlined text-base">location_on</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Address</p>
                <p className="font-semibold text-slate-800">{schoolProfile.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General Settings */}
      <section className="space-y-2">
        <h3 className="px-1 font-bold text-xs uppercase tracking-wider text-slate-500">General Settings</h3>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden shadow-sm">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500">notifications</span>
              <span className="font-medium text-slate-800">Push Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500">dark_mode</span>
              <span className="font-medium text-slate-800">Dark Mode</span>
            </div>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Language */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500">language</span>
              <span className="font-medium text-slate-800">Language</span>
            </div>
            <span className="text-slate-500 font-semibold">English (US)</span>
          </div>

          {/* Backup / Seed Data */}
          <div
            onClick={handleReseed}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-600">cloud_upload</span>
              <span className="font-semibold text-indigo-600">Re-seed Firestore Dataset</span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm">refresh</span>
          </div>
        </div>
      </section>

      {/* Support & Info */}
      <section className="space-y-2">
        <h3 className="px-1 font-bold text-xs uppercase tracking-wider text-slate-500">Account & Support</h3>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden shadow-sm">
          {/* Account Status */}
          <div
            onClick={onOpenAuthModal}
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500">account_circle</span>
              <div>
                <span className="font-semibold text-slate-800 block">
                  {user ? user.displayName : 'Sign In to Account'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {user ? user.email : 'Click to authenticate via Firebase'}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          </div>

          {/* About App */}
          <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500">info</span>
              <span className="font-medium text-slate-800">About BrightStart</span>
            </div>
            <span className="text-slate-500 font-medium">v2.4.0</span>
          </div>

          {/* Logout */}
          {user && (
            <div
              onClick={onOpenAuthModal}
              className="flex items-center justify-between p-3.5 hover:bg-rose-50 transition-colors cursor-pointer text-rose-600"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-600">logout</span>
                <span className="font-bold">Logout</span>
              </div>
              <span className="material-symbols-outlined text-rose-600 text-sm">chevron_right</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="py-6 text-center space-y-1 text-xs text-slate-500">
        <p className="font-bold text-indigo-600">BrightStart Management v2.4.0</p>
        <p className="text-[11px]">Production-Ready Firebase Firestore & Hosting Integration</p>
      </div>
    </div>
  );
};
