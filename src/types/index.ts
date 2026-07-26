export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface Student {
  id: string;
  name: string;
  grade: string; // e.g. 'Grade 3A'
  gradeLevel: string; // e.g. 'Grade 3'
  rollNumber: string; // e.g. '204'
  phone: string;
  email?: string;
  status: AttendanceStatus;
  attendancePercentage: number;
  avatarUrl: string;
  parentName?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id: string; // e.g. '2026-07-26_Grade 3A'
  date: string; // YYYY-MM-DD
  grade: string;
  records: Record<string, AttendanceStatus>; // studentId -> status
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  markedBy?: string;
  updatedAt: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  district: string;
  principal: string;
  phone: string;
  address: string;
  coverUrl: string;
  logoUrl: string;
  email: string;
  academicYear: string;
  totalStudentsCount?: number;
  totalTeachersCount?: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  dayNumber: string; // e.g. '24'
  month: string; // e.g. 'OCT'
  time: string; // e.g. '9:00 AM'
  location: string;
  category: 'Academic' | 'Meeting' | 'Sports' | 'Cultural' | 'General';
  description?: string;
  createdAt: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  feeType: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'High' | 'Normal' | 'Low';
  targetGrade?: string;
  author: string;
  createdAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'lesson_plan' | 'homework' | 'quiz' | 'parent_notice' | 'activity' | 'general';
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'Principal' | 'Teacher' | 'Admin';
  photoURL?: string;
}
