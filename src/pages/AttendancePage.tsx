import React, { useState, useEffect } from 'react';
import { Student, AttendanceStatus } from '../types';
import { saveAttendanceRecord } from '../lib/firestoreService';

interface AttendancePageProps {
  students: Student[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ students, showToast }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 3A');

  // Map student ID to attendance status
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);

  // Filter students by selected grade
  const gradeStudents = students.filter(
    (s) => s.grade === selectedGrade || s.gradeLevel === selectedGrade
  );

  useEffect(() => {
    // Initialize map from student current status
    const initialMap: Record<string, AttendanceStatus> = {};
    gradeStudents.forEach((student) => {
      initialMap[student.id] = student.status || 'Present';
    });
    setAttendanceMap(initialMap);
  }, [selectedGrade, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updatedMap: Record<string, AttendanceStatus> = {};
    gradeStudents.forEach((student) => {
      updatedMap[student.id] = 'Present';
    });
    setAttendanceMap(updatedMap);
    showToast(`Marked all ${gradeStudents.length} students as Present`, 'info');
  };

  const handleSaveAttendance = async () => {
    if (gradeStudents.length === 0) {
      showToast('No students in this grade to record attendance.', 'error');
      return;
    }

    try {
      setSaving(true);
      await saveAttendanceRecord(selectedDate, selectedGrade, attendanceMap);
      showToast(`Attendance for ${selectedGrade} saved to Firestore!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    present: Object.values(attendanceMap).filter((s) => s === 'Present').length,
    absent: Object.values(attendanceMap).filter((s) => s === 'Absent').length,
    late: Object.values(attendanceMap).filter((s) => s === 'Late').length
  };

  return (
    <div className="pt-20 pb-32 px-4 max-w-xl mx-auto min-h-screen">
      {/* Title */}
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 text-2xl">fact_check</span>
          Attendance Management
        </h2>
        <p className="text-xs text-slate-500">
          Mark daily attendance for students and sync directly to Firestore.
        </p>
      </div>

      {/* Date & Grade Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 grid grid-cols-2 gap-3 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Class / Grade</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="Grade 3A">Grade 3A</option>
            <option value="Grade 1A">Grade 1A</option>
            <option value="Grade 2B">Grade 2B</option>
            <option value="Grade 4A">Grade 4A</option>
            <option value="Grade 5A">Grade 5A</option>
          </select>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center justify-between mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {counts.present} Present
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {counts.absent} Absent
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            {counts.late} Late
          </span>
        </div>

        <button
          onClick={handleMarkAllPresent}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          Mark All Present
        </button>
      </div>

      {/* Student Attendance Cards */}
      <div className="space-y-2.5 mb-6">
        {gradeStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500 shadow-sm">
            No students found in {selectedGrade}. Add students to this grade in the Students tab.
          </div>
        ) : (
          gradeStudents.map((student) => {
            const currentStatus = attendanceMap[student.id] || 'Present';

            return (
              <div
                key={student.id}
                className="bg-white rounded-xl p-3.5 flex items-center justify-between gap-3 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300'}
                    alt={student.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {student.name}
                    </h4>
                    <p className="text-xs text-slate-500">Roll #{student.rollNumber}</p>
                  </div>
                </div>

                {/* Status Selector Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleStatusChange(student.id, 'Present')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'Present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    P
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'Absent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'Absent'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    A
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'Late')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'Late'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    L
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Save Button */}
      {gradeStudents.length > 0 && (
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">sync</span>
              Saving to Firestore...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
              Save Attendance ({selectedDate})
            </>
          )}
        </button>
      )}
    </div>
  );
};
