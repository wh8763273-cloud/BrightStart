import React, { useState } from 'react';
import { Student } from '../types';
import { StudentCard } from '../components/StudentCard';

interface StudentsPageProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddStudent: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  onSelectStudent,
  onOpenAddStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('All');

  const gradeOptions = ['All', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGradeFilter === 'All' ||
      student.gradeLevel === selectedGradeFilter ||
      student.grade.startsWith(selectedGradeFilter);

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="pt-20 pb-32 px-4 max-w-xl mx-auto min-h-screen relative">
      {/* Search and Filter Section */}
      <section className="mb-4">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name or ID..."
            className="w-full h-11 pl-11 pr-10 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 placeholder:text-slate-400 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Grade Filter Chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {gradeOptions.map((grade) => {
            const isActive = selectedGradeFilter === grade;
            return (
              <button
                key={grade}
                onClick={() => setSelectedGradeFilter(grade)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {grade === 'All' ? 'All Students' : grade}
              </button>
            );
          })}
        </div>
      </section>

      {/* Student List Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
        </span>
        <button
          onClick={onOpenAddStudent}
          className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add Student
        </button>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center my-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">person_search</span>
            <h3 className="font-bold text-base text-slate-900">No Students Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              No matching records found for "{searchQuery || selectedGradeFilter}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGradeFilter('All');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={onSelectStudent}
            />
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={onOpenAddStudent}
        className="fixed bottom-20 right-6 w-12 h-12 bg-indigo-600 text-white rounded-xl shadow-md border border-indigo-700 flex items-center justify-center z-40 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
        title="Add New Student"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
};
