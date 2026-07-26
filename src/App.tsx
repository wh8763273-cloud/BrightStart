import React, { useState, useEffect } from 'react';
import {
  Student,
  SchoolProfile,
  EventItem,
  FeeRecord,
  Announcement,
  AppUser
} from './types';
import {
  subscribeStudents,
  subscribeSchoolProfile,
  subscribeEvents,
  subscribeFees,
  subscribeAnnouncements,
  seedInitialDataIfEmpty,
  addStudent,
  updateStudent,
  deleteStudent,
  updateSchoolProfile,
  addEvent,
  addAnnouncement
} from './lib/firestoreService';
import { subscribeToAuth } from './lib/authService';

import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { Toast, ToastMessage } from './components/Toast';

import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { AIChatPage } from './pages/AIChatPage';
import { SettingsPage } from './pages/SettingsPage';

import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { EventModal } from './components/EventModal';
import { NoticeModal } from './components/NoticeModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Realtime Firestore Collections
  const [students, setStudents] = useState<Student[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
    id: 'main',
    name: 'BrightStart Primary School',
    district: 'Springfield District #12',
    principal: 'Principal Sarah Miller',
    phone: '+1 555-0199',
    address: '123 Education Lane, Springfield',
    coverUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300',
    email: 'principal.sarah@brightstart.edu',
    academicYear: '2026-2027',
    totalStudentsCount: 450,
    totalTeachersCount: 32
  });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // User Auth State
  const [user, setUser] = useState<AppUser | null>({
    uid: 'demo-principal-id',
    email: 'principal.sarah@brightstart.edu',
    displayName: 'Principal Sarah Miller',
    role: 'Principal'
  });

  // Toasts Manager
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modal Controls
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  const [isSchoolProfileModalOpen, setIsSchoolProfileModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize Firestore auto-seed & realtime subscriptions
  useEffect(() => {
    seedInitialDataIfEmpty();

    const unsubStudents = subscribeStudents((list) => setStudents(list));
    const unsubProfile = subscribeSchoolProfile((profile) => setSchoolProfile(profile));
    const unsubEvents = subscribeEvents((list) => setEvents(list));
    const unsubFees = subscribeFees((list) => setFees(list));
    const unsubAnnouncements = subscribeAnnouncements((list) => setAnnouncements(list));
    const unsubAuth = subscribeToAuth((currentUser) => {
      if (currentUser) setUser(currentUser);
    });

    return () => {
      unsubStudents();
      unsubProfile();
      unsubEvents();
      unsubFees();
      unsubAnnouncements();
      unsubAuth();
    };
  }, []);

  // Handlers
  const handleSaveStudent = async (studentData: Omit<Student, 'id'>, id?: string) => {
    if (id) {
      await updateStudent(id, studentData);
      showToast(`Updated student profile for ${studentData.name}`, 'success');
    } else {
      await addStudent(studentData);
      showToast(`Added ${studentData.name} to Firestore!`, 'success');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteStudent(id);
    showToast('Student deleted from database', 'info');
  };

  const handleSaveSchoolProfile = async (updates: Partial<SchoolProfile>) => {
    await updateSchoolProfile(updates);
    showToast('School profile updated in Firestore!', 'success');
  };

  const handleSaveEvent = async (eventData: Omit<EventItem, 'id'>) => {
    await addEvent(eventData);
    showToast(`Added event "${eventData.title}"`, 'success');
  };

  const handleSaveNotice = async (noticeData: Omit<Announcement, 'id'>) => {
    await addAnnouncement(noticeData);
    showToast('Posted school notice to Firestore!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F2F7FD] font-sans text-[#1a1c1c] selection:bg-[#2976c7] selection:text-white">
      {/* Top App Bar */}
      <Header
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        announcements={announcements}
      />

      {/* Toast Banner */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Main Tab Routing */}
      <main className="w-full">
        {activeTab === 'dashboard' && (
          <DashboardPage
            schoolProfile={schoolProfile}
            students={students}
            events={events}
            fees={fees}
            onNavigateTab={setActiveTab}
            onOpenAddStudent={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
            onOpenPostNotice={() => setIsNoticeModalOpen(true)}
          />
        )}

        {activeTab === 'students' && (
          <StudentsPage
            students={students}
            onSelectStudent={(student) => setSelectedStudentDetail(student)}
            onOpenAddStudent={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendancePage students={students} showToast={showToast} />
        )}

        {activeTab === 'aichat' && <AIChatPage showToast={showToast} />}

        {activeTab === 'settings' && (
          <SettingsPage
            schoolProfile={schoolProfile}
            user={user}
            onOpenEditProfile={() => setIsSchoolProfileModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            showToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />

      <StudentDetailModal
        student={selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
        onEdit={(student) => {
          setEditingStudent(student);
          setIsStudentModalOpen(true);
        }}
        onDelete={handleDeleteStudent}
      />

      <SchoolProfileModal
        isOpen={isSchoolProfileModalOpen}
        onClose={() => setIsSchoolProfileModalOpen(false)}
        profile={schoolProfile}
        onSave={handleSaveSchoolProfile}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
      />

      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        onSave={handleSaveNotice}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUserChanged={setUser}
        showToast={showToast}
      />
    </div>
  );
}
