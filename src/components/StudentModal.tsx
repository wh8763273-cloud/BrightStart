import React, { useState, useEffect } from 'react';
import { Student, AttendanceStatus } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id'>, id?: string) => Promise<void>;
  initialData?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: 'Grade 3A',
    gradeLevel: 'Grade 3',
    rollNumber: '',
    phone: '',
    email: '',
    status: 'Present' as AttendanceStatus,
    attendancePercentage: 95,
    avatarUrl: '',
    parentName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    address: '',
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        grade: initialData.grade || 'Grade 3A',
        gradeLevel: initialData.gradeLevel || 'Grade 3',
        rollNumber: initialData.rollNumber || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        status: initialData.status || 'Present',
        attendancePercentage: initialData.attendancePercentage ?? 95,
        avatarUrl: initialData.avatarUrl || '',
        parentName: initialData.parentName || '',
        dateOfBirth: initialData.dateOfBirth || '',
        gender: initialData.gender || 'Male',
        address: initialData.address || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        grade: 'Grade 3A',
        gradeLevel: 'Grade 3',
        rollNumber: Math.floor(100 + Math.random() * 900).toString(),
        phone: '+1 234 567 ' + Math.floor(100 + Math.random() * 900),
        email: '',
        status: 'Present',
        attendancePercentage: 95,
        avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300',
        parentName: '',
        dateOfBirth: '2017-06-15',
        gender: 'Male',
        address: '',
        notes: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Student name is required.');
      return;
    }
    if (!formData.rollNumber.trim()) {
      setError('Roll number is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const gradeLevel = formData.grade.split(' ')[0] || 'Grade 3';
      await onSave({ ...formData, gradeLevel }, initialData?.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save student details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">person_add</span>
            {initialData ? 'Edit Student Profile' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Johnson"
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number *</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 204"
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Class</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
              >
                <option value="Grade 1A">Grade 1A</option>
                <option value="Grade 1B">Grade 1B</option>
                <option value="Grade 2A">Grade 2A</option>
                <option value="Grade 2B">Grade 2B</option>
                <option value="Grade 3A">Grade 3A</option>
                <option value="Grade 3B">Grade 3B</option>
                <option value="Grade 4A">Grade 4A</option>
                <option value="Grade 5A">Grade 5A</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceStatus })}
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Name</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Robert Johnson"
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attendance Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendancePercentage}
                onChange={(e) => setFormData({ ...formData, attendancePercentage: parseInt(e.target.value) || 0 })}
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar Photo URL</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 45 Maple Ave, Springfield"
              className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher Notes / Remarks</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Academic strengths, extracurriculars, or special needs..."
              className="w-full p-3 bg-white rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs text-slate-900"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Saving...
                </>
              ) : (
                'Save Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
