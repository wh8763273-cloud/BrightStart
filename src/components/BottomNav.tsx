import React from 'react';

export type NavTab = 'dashboard' | 'students' | 'attendance' | 'aichat' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'students', label: 'Students', icon: 'group' },
    { id: 'attendance', label: 'Attendance', icon: 'fact_check' },
    { id: 'aichat', label: 'AI Chat', icon: 'smart_toy' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto w-full z-50 flex justify-around items-center px-3 py-2 bg-white shadow-sm border-t border-slate-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span
              className={`material-symbols-outlined text-xl ${
                isActive ? 'fill-1 text-indigo-600' : 'text-slate-400'
              }`}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
