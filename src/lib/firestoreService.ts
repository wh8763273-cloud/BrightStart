import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  Student,
  AttendanceRecord,
  SchoolProfile,
  EventItem,
  FeeRecord,
  Announcement,
  AIChatMessage,
  AttendanceStatus
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

const COLLECTIONS = {
  STUDENTS: 'students',
  ATTENDANCE: 'attendance',
  SCHOOL_PROFILE: 'schoolProfile',
  EVENTS: 'events',
  FEES: 'fees',
  ANNOUNCEMENTS: 'announcements',
  AI_CHAT: 'aiHistory'
};

// Default seed data matching Google Stitch mocks
const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
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
};

const DEFAULT_STUDENTS: Omit<Student, 'id'>[] = [
  {
    name: 'Alex Johnson',
    grade: 'Grade 3A',
    gradeLevel: 'Grade 3',
    rollNumber: '204',
    phone: '+1 234 567 890',
    email: 'alex.j@student.brightstart.edu',
    status: 'Present',
    attendancePercentage: 98,
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300',
    parentName: 'Robert Johnson',
    dateOfBirth: '2017-05-14',
    gender: 'Male',
    address: '45 Maple Ave, Springfield',
    notes: 'Excels in science and mathematics.'
  },
  {
    name: 'Maya Patel',
    grade: 'Grade 3A',
    gradeLevel: 'Grade 3',
    rollNumber: '211',
    phone: '+1 234 567 891',
    email: 'maya.p@student.brightstart.edu',
    status: 'Absent',
    attendancePercentage: 85,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    parentName: 'Priya Patel',
    dateOfBirth: '2017-09-21',
    gender: 'Female',
    address: '88 Oak Lane, Springfield',
    notes: 'Avid reader, member of school choir.'
  },
  {
    name: 'Lucas White',
    grade: 'Grade 3A',
    gradeLevel: 'Grade 3',
    rollNumber: '207',
    phone: '+1 234 567 892',
    email: 'lucas.w@student.brightstart.edu',
    status: 'Present',
    attendancePercentage: 92,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    parentName: 'David White',
    dateOfBirth: '2017-03-10',
    gender: 'Male',
    address: '12 Pine St, Springfield',
    notes: 'Very active in physical education.'
  },
  {
    name: 'Sophia Chen',
    grade: 'Grade 1A',
    gradeLevel: 'Grade 1',
    rollNumber: '101',
    phone: '+1 234 567 893',
    email: 'sophia.c@student.brightstart.edu',
    status: 'Present',
    attendancePercentage: 96,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    parentName: 'Wei Chen',
    dateOfBirth: '2019-11-04',
    gender: 'Female',
    address: '204 Cedar Rd, Springfield',
    notes: 'Loves art and drawing.'
  },
  {
    name: 'Ethan Miller',
    grade: 'Grade 2B',
    gradeLevel: 'Grade 2',
    rollNumber: '105',
    phone: '+1 234 567 894',
    email: 'ethan.m@student.brightstart.edu',
    status: 'Present',
    attendancePercentage: 90,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    parentName: 'Laura Miller',
    dateOfBirth: '2018-02-18',
    gender: 'Male',
    address: '77 Birch Blvd, Springfield',
    notes: 'Quick with mental math.'
  },
  {
    name: 'Isabella Gomez',
    grade: 'Grade 4A',
    gradeLevel: 'Grade 4',
    rollNumber: '302',
    phone: '+1 234 567 895',
    email: 'isabella.g@student.brightstart.edu',
    status: 'Present',
    attendancePercentage: 97,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    parentName: 'Carlos Gomez',
    dateOfBirth: '2016-08-12',
    gender: 'Female',
    address: '51 Willow Way, Springfield',
    notes: 'Class monitor for Grade 4A.'
  },
  {
    name: 'Noah Davis',
    grade: 'Grade 3B',
    gradeLevel: 'Grade 3',
    rollNumber: '215',
    phone: '+1 234 567 896',
    email: 'noah.d@student.brightstart.edu',
    status: 'Late',
    attendancePercentage: 88,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    parentName: 'Sarah Davis',
    dateOfBirth: '2017-01-30',
    gender: 'Male',
    address: '109 Elm St, Springfield',
    notes: 'Enthusiastic robotics club member.'
  }
];

const DEFAULT_EVENTS: Omit<EventItem, 'id'>[] = [
  {
    title: 'Science Fair',
    date: '2026-10-24',
    dayNumber: '24',
    month: 'OCT',
    time: '9:00 AM',
    location: 'Main Auditorium',
    category: 'Academic',
    description: 'Annual STEM project exhibition showcasing student innovations.',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Parent-Teacher Meeting',
    date: '2026-10-27',
    dayNumber: '27',
    month: 'OCT',
    time: '3:00 PM',
    location: 'Classrooms / Library',
    category: 'Meeting',
    description: 'Quarterly review of student progress and learning goals.',
    createdAt: new Date().toISOString()
  },
  {
    title: 'Annual Sports Day',
    date: '2026-11-10',
    dayNumber: '10',
    month: 'NOV',
    time: '8:30 AM',
    location: 'School Athletic Ground',
    category: 'Sports',
    description: 'Inter-house athletic competitions and relay races.',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_FEES: Omit<FeeRecord, 'id'>[] = [
  {
    studentId: 'seed-maya',
    studentName: 'Maya Patel',
    grade: 'Grade 3A',
    amount: 800,
    status: 'Pending',
    dueDate: '2026-10-30',
    feeType: 'Term 2 Tuition Fee'
  },
  {
    studentId: 'seed-noah',
    studentName: 'Noah Davis',
    grade: 'Grade 3B',
    amount: 800,
    status: 'Pending',
    dueDate: '2026-10-30',
    feeType: 'Sports & Activity Fee'
  },
  {
    studentId: 'seed-ethan',
    studentName: 'Ethan Miller',
    grade: 'Grade 2B',
    amount: 800,
    status: 'Pending',
    dueDate: '2026-10-30',
    feeType: 'Library & Tech Fee'
  },
  {
    studentId: 'seed-alex',
    studentName: 'Alex Johnson',
    grade: 'Grade 3A',
    amount: 800,
    status: 'Paid',
    dueDate: '2026-09-30',
    paidDate: '2026-09-28',
    feeType: 'Term 2 Tuition Fee'
  }
];

const DEFAULT_ANNOUNCEMENTS: Omit<Announcement, 'id'>[] = [
  {
    title: 'Science Fair Preparation Guidelines',
    content: 'All Grade 3-5 participants must submit their project poster outlines by Wednesday.',
    date: '2026-10-20',
    priority: 'High',
    author: 'Principal Sarah Miller',
    createdAt: new Date().toISOString()
  },
  {
    title: 'School Closed for Professional Development Day',
    content: 'School will remain closed on Monday for teacher training and curriculum planning.',
    date: '2026-10-18',
    priority: 'Normal',
    author: 'Administration',
    createdAt: new Date().toISOString()
  }
];

// Seed initial data if Firestore is empty
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    // 1. Check School Profile
    const profileRef = doc(db, COLLECTIONS.SCHOOL_PROFILE, 'main');
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await setDoc(profileRef, DEFAULT_SCHOOL_PROFILE);
    }

    // 2. Check Students
    const studentsSnap = await getDocs(collection(db, COLLECTIONS.STUDENTS));
    if (studentsSnap.empty) {
      for (const student of DEFAULT_STUDENTS) {
        await addDoc(collection(db, COLLECTIONS.STUDENTS), {
          ...student,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 3. Check Events
    const eventsSnap = await getDocs(collection(db, COLLECTIONS.EVENTS));
    if (eventsSnap.empty) {
      for (const evt of DEFAULT_EVENTS) {
        await addDoc(collection(db, COLLECTIONS.EVENTS), evt);
      }
    }

    // 4. Check Fees
    const feesSnap = await getDocs(collection(db, COLLECTIONS.FEES));
    if (feesSnap.empty) {
      for (const fee of DEFAULT_FEES) {
        await addDoc(collection(db, COLLECTIONS.FEES), fee);
      }
    }

    // 5. Check Announcements
    const announcementsSnap = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS));
    if (announcementsSnap.empty) {
      for (const ann of DEFAULT_ANNOUNCEMENTS) {
        await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), ann);
      }
    }
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
  }
}

// ==================== STUDENTS CRUD ====================

export function subscribeStudents(callback: (students: Student[]) => void) {
  const q = query(collection(db, COLLECTIONS.STUDENTS));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Student[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Student, 'id'>)
      }));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.STUDENTS);
      callback([]);
    }
  );
}

export async function addStudent(studentData: Omit<Student, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.STUDENTS), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTIONS.STUDENTS);
    throw error;
  }
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.STUDENTS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.STUDENTS}/${id}`);
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.STUDENTS, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.STUDENTS}/${id}`);
    throw error;
  }
}

// ==================== ATTENDANCE CRUD ====================

export function subscribeAttendance(callback: (records: AttendanceRecord[]) => void) {
  const q = query(collection(db, COLLECTIONS.ATTENDANCE));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AttendanceRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AttendanceRecord, 'id'>)
      }));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.ATTENDANCE);
      callback([]);
    }
  );
}

export async function saveAttendanceRecord(
  date: string,
  grade: string,
  records: Record<string, AttendanceStatus>
): Promise<void> {
  const recordId = `${date}_${grade.replace(/\s+/g, '_')}`;
  const docRef = doc(db, COLLECTIONS.ATTENDANCE, recordId);

  const statuses = Object.values(records);
  const totalStudents = statuses.length;
  const totalPresent = statuses.filter((s) => s === 'Present').length;
  const totalAbsent = statuses.filter((s) => s === 'Absent').length;
  const totalLate = statuses.filter((s) => s === 'Late').length;

  const attendanceData: Omit<AttendanceRecord, 'id'> = {
    date,
    grade,
    records,
    totalStudents,
    totalPresent,
    totalAbsent,
    totalLate,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(docRef, attendanceData, { merge: true });

    // Update status on individual student documents
    for (const [studentId, status] of Object.entries(records)) {
      try {
        await updateStudent(studentId, { status });
      } catch (e) {
        console.warn(`Could not update student status for ${studentId}:`, e);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.ATTENDANCE}/${recordId}`);
    throw error;
  }
}

// ==================== SCHOOL PROFILE CRUD ====================

export function subscribeSchoolProfile(callback: (profile: SchoolProfile) => void) {
  const docRef = doc(db, COLLECTIONS.SCHOOL_PROFILE, 'main');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...(snapshot.data() as Omit<SchoolProfile, 'id'>) });
      } else {
        callback(DEFAULT_SCHOOL_PROFILE);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${COLLECTIONS.SCHOOL_PROFILE}/main`);
      callback(DEFAULT_SCHOOL_PROFILE);
    }
  );
}

export async function updateSchoolProfile(updates: Partial<SchoolProfile>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.SCHOOL_PROFILE, 'main');
    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.SCHOOL_PROFILE}/main`);
    throw error;
  }
}

// ==================== EVENTS CRUD ====================

export function subscribeEvents(callback: (events: EventItem[]) => void) {
  const q = query(collection(db, COLLECTIONS.EVENTS));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: EventItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventItem, 'id'>)
      }));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.EVENTS);
      callback([]);
    }
  );
}

export async function addEvent(eventData: Omit<EventItem, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...eventData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTIONS.EVENTS);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EVENTS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.EVENTS}/${id}`);
    throw error;
  }
}

// ==================== FEES CRUD ====================

export function subscribeFees(callback: (fees: FeeRecord[]) => void) {
  const q = query(collection(db, COLLECTIONS.FEES));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: FeeRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FeeRecord, 'id'>)
      }));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.FEES);
      callback([]);
    }
  );
}

export async function updateFeeStatus(id: string, status: 'Paid' | 'Pending' | 'Overdue'): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.FEES, id);
    const updates: Partial<FeeRecord> = { status };
    if (status === 'Paid') {
      updates.paidDate = new Date().toISOString().split('T')[0];
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.FEES}/${id}`);
    throw error;
  }
}

export async function addFeeRecord(feeData: Omit<FeeRecord, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FEES), feeData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTIONS.FEES);
    throw error;
  }
}

// ==================== ANNOUNCEMENTS CRUD ====================

export function subscribeAnnouncements(callback: (announcements: Announcement[]) => void) {
  const q = query(collection(db, COLLECTIONS.ANNOUNCEMENTS));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Announcement[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Announcement, 'id'>)
      }));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.ANNOUNCEMENTS);
      callback([]);
    }
  );
}

export async function addAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
      ...announcement,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTIONS.ANNOUNCEMENTS);
    throw error;
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.ANNOUNCEMENTS}/${id}`);
    throw error;
  }
}

// ==================== AI CHAT HISTORY ====================

export function subscribeChatMessages(callback: (messages: AIChatMessage[]) => void) {
  const q = query(collection(db, COLLECTIONS.AI_CHAT));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AIChatMessage[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AIChatMessage, 'id'>)
      }));
      // sort chronologically
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.AI_CHAT);
      callback([]);
    }
  );
}

export async function saveChatMessage(message: Omit<AIChatMessage, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.AI_CHAT), message);
  return docRef.id;
}

export async function clearChatHistory(): Promise<void> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.AI_CHAT));
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
}
