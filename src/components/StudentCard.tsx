import React from 'react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  onEdit?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick, onEdit }) => {
  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'Present':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            Present
          </span>
        );
      case 'Absent':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
            Absent
          </span>
        );
      case 'Late':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
            Late
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-500 text-emerald-700';
    if (percentage >= 75) return 'bg-indigo-600 text-indigo-700';
    return 'bg-rose-500 text-rose-700';
  };

  return (
    <div
      onClick={() => onClick(student)}
      className="student-card bg-white rounded-xl p-4 flex items-start gap-3.5 cursor-pointer hover:border-slate-300 transition-all border border-slate-200 shadow-sm"
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
        <img
          src={student.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300'}
          alt={student.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300';
          }}
        />
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-base text-slate-900 truncate">
            {student.name}
          </h3>
          {getStatusBadge(student.status)}
        </div>

        <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1 font-medium">
          <span className="font-semibold text-slate-700">{student.grade}</span> • Roll #{student.rollNumber}
        </p>

        <div className="mt-2.5 flex flex-col gap-1.5">
          <a
            href={`tel:${student.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-xs font-medium"
          >
            <span className="material-symbols-outlined text-base">call</span>
            <span>{student.phone}</span>
          </a>

          <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getAttendanceColor(student.attendancePercentage).split(' ')[0]}`}
              style={{ width: `${student.attendancePercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-500 font-medium">Attendance</span>
            <span className={`font-bold ${getAttendanceColor(student.attendancePercentage).split(' ')[1]}`}>
              {student.attendancePercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
