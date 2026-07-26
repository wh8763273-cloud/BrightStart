import React from 'react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!student) return null;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${student.name} from the school database?`)) {
      await onDelete(student.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-200 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300'}
              alt={student.name}
              className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-sm"
            />
            <div>
              <h2 className="font-bold text-lg text-slate-900">{student.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {student.grade} • Roll #{student.rollNumber}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                student.status === 'Present'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : student.status === 'Absent'
                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {student.status} Today
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="space-y-2.5 my-4 border-y border-slate-100 py-3.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Parent Name:</span>
            <span className="font-semibold text-slate-900">{student.parentName || 'N/A'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Phone Number:</span>
            <a href={`tel:${student.phone}`} className="font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">call</span>
              {student.phone}
            </a>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Overall Attendance:</span>
            <span className="font-bold text-emerald-700">{student.attendancePercentage}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Address:</span>
            <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{student.address || 'N/A'}</span>
          </div>

          {student.notes && (
            <div className="pt-2">
              <span className="text-slate-500 block mb-1">Teacher Remarks:</span>
              <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 italic text-xs">{student.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <a
            href={`tel:${student.phone}`}
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            Call Parent
          </a>

          <button
            onClick={() => {
              onClose();
              onEdit(student);
            }}
            className="flex-1 py-2.5 rounded-lg bg-slate-100 text-indigo-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0"
            title="Delete Student"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
