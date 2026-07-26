import React from 'react';
import { Student, EventItem, FeeRecord, SchoolProfile } from '../types';
import { NavTab } from '../components/BottomNav';

interface DashboardPageProps {
  schoolProfile: SchoolProfile;
  students: Student[];
  events: EventItem[];
  fees: FeeRecord[];
  onNavigateTab: (tab: NavTab) => void;
  onOpenAddStudent: () => void;
  onOpenPostNotice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  schoolProfile,
  students,
  events,
  fees,
  onNavigateTab,
  onOpenAddStudent,
  onOpenPostNotice
}) => {
  const totalStudents = students.length > 0 ? students.length : 450;
  const totalTeachers = schoolProfile.totalTeachersCount || 32;

  // Calculate today's attendance percentage
  const presentCount = students.filter((s) => s.status === 'Present').length;
  const attendanceRate = students.length > 0
    ? Math.round((presentCount / students.length) * 100)
    : 96;

  // Calculate pending fees
  const pendingFeesTotal = fees
    .filter((f) => f.status === 'Pending' || f.status === 'Overdue')
    .reduce((acc, f) => acc + f.amount, 0) || 2400;

  return (
    <div className="pt-20 pb-28 px-4 max-w-xl mx-auto min-h-screen">
      {/* Welcome Hero Section */}
      <section className="py-2">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-2xl text-slate-900 tracking-tight">
            Good Morning, {schoolProfile.principal || 'Principal Sarah'}!
          </h2>
          <p className="text-sm text-slate-500">
            Here's what's happening at {schoolProfile.name} today.
          </p>
        </div>

        {/* AI Copilot Callout Banner */}
        <div className="mt-4 relative overflow-hidden rounded-xl bg-indigo-600 p-5 text-white flex justify-between items-center shadow-sm border border-indigo-700">
          <div className="z-10 max-w-[65%]">
            <h3 className="font-bold text-base mb-2 leading-snug">
              Need help with reports or scheduling?
            </h3>
            <button
              onClick={() => onNavigateTab('aichat')}
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              Ask AI Assistant
            </button>
          </div>

          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <span className="material-symbols-outlined text-4xl text-indigo-100">school</span>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-3.5 py-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">group</span>
            </div>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              +2%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">Total Students</span>
            <span className="font-bold text-2xl text-slate-900">{totalStudents}</span>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
              Active
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">Total Teachers</span>
            <span className="font-bold text-2xl text-slate-900">{totalTeachers}</span>
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">fact_check</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">Attendance</span>
            <span className="font-bold text-2xl text-slate-900">{attendanceRate}%</span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Due
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">Pending Fees</span>
            <span className="font-bold text-2xl text-amber-600">${pendingFeesTotal.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-2">
        <h3 className="font-bold text-sm text-slate-900 mb-3 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group"
          >
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined">how_to_reg</span>
            </div>
            <span className="text-[11px] font-medium text-center text-slate-700 leading-tight">
              Attendance
            </span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group"
          >
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <span className="text-[11px] font-medium text-center text-slate-700 leading-tight">
              Add Student
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('aichat')}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group"
          >
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <span className="text-[11px] font-medium text-center text-slate-700 leading-tight">
              AI Lessons
            </span>
          </button>

          <button
            onClick={onOpenPostNotice}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform group"
          >
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <span className="text-[11px] font-medium text-center text-slate-700 leading-tight">
              Post Notice
            </span>
          </button>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">Upcoming Events</h3>
          <span className="text-xs font-semibold text-indigo-600 cursor-pointer hover:underline">View All</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {events.map((evt) => (
            <div key={evt.id} className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center gap-3.5 shadow-sm hover:border-slate-300 transition-all">
              <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-lg flex flex-col items-center justify-center text-indigo-700 flex-shrink-0">
                <span className="font-bold text-sm leading-none">{evt.dayNumber || '24'}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{evt.month || 'OCT'}</span>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-sm text-slate-900 truncate">{evt.title}</h4>
                <p className="text-xs text-slate-500">{evt.location} • {evt.time}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
