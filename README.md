# BrightStart - School Management & AI Copilot

BrightStart is a production-ready, full-stack Primary School Management System and AI Copilot built with React 19, TypeScript, Vite, Tailwind CSS, Firebase v10+ (Firestore, Authentication, Storage, Hosting), and Google Gemini AI API.

---

## 🌟 Key Features

1. **Dashboard Overview**
   - Live Bento stats: Total Students, Teachers, Attendance rate, Pending Fees.
   - Good Morning Principal hero section with AI Assistant quick action button.
   - Quick Actions: Take Attendance, Add Student, Lesson Generator, Post Notice.
   - Upcoming Events feed (Science Fair, Parent-Teacher Meetings, Sports Day).

2. **Student Management & Complete CRUD**
   - Real-time Firestore sync for all student documents.
   - Search by student name, roll number, or grade.
   - Grade Filter Chips (All, Grade 1, Grade 2, Grade 3, Grade 4, Grade 5).
   - Add/Edit/Delete student with form validation and custom avatars.
   - Interactive attendance status badges (Present, Absent, Late).

3. **Attendance Management**
   - Class-level and date-level attendance tracking.
   - One-click "Mark All Present" batch action.
   - Real-time batch write to Cloud Firestore.

4. **Built-in AI Assistant (Gemini API)**
   - Teacher & Principal AI Copilot powered by Google Gemini API (`gemini-2.5-flash`).
   - Preset educational prompts:
     - 📖 Lesson Plan Generator
     - 📝 Quiz / Exam Creator
     - ✉️ Parent Notice Writer
     - 🎮 Classroom Activities
     - 📚 Homework Assignment Generator
   - Copy to clipboard & real-time chat history saved in Firestore.

5. **School Profile & Settings**
   - Editable school profile (Name, Principal, District, Address, Phone).
   - Firebase Authentication with instant Zero-Friction Demo Login buttons.
   - Dark mode toggle & dataset restore tools.

---

## 📁 Project Folder Structure

```
.
├── firebase-applet-config.json  # Auto-generated Firebase Project Credentials
├── firebase.json                # Firebase Hosting, Firestore, Storage Deployment Config
├── firestore.rules              # Firestore Security Rules
├── storage.rules                # Firebase Storage Security Rules
├── server.ts                    # Express + Vite Server with Gemini AI Proxy Endpoint
├── package.json                 # Dependencies & Build Scripts
├── vite.config.ts               # Vite Configuration
├── .env.example                 # Environment Variable Declarations
├── src/
│   ├── main.tsx                 # React Root Entrypoint
│   ├── App.tsx                  # Main Layout & Tab Router
│   ├── index.css                # Global Styles, Font Pairings & Design Tokens
│   ├── types/
│   │   └── index.ts             # TypeScript Interfaces (Student, Attendance, SchoolProfile, etc.)
│   ├── lib/
│   │   ├── firebase.ts          # Firebase SDK Initialization
│   │   ├── firestoreService.ts  # Real-time Firestore CRUD & Auto-seeding
│   │   ├── authService.ts       # Firebase Authentication & Demo Sessions
│   │   └── aiService.ts         # Gemini AI Frontend Wrapper & Presets
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Main School Analytics & Overview
│   │   ├── StudentsPage.tsx     # Student Directory & Search
│   │   ├── AttendancePage.tsx   # Daily Class Attendance Marker
│   │   ├── AIChatPage.tsx       # AI Assistant Chat & Teacher Tools
│   │   └── SettingsPage.tsx     # School Profile & Settings
│   └── components/
│       ├── Header.tsx           # App Top Bar with Announcements Drawer
│       ├── BottomNav.tsx        # Responsive Bottom Navigation Bar
│       ├── StudentCard.tsx      # Student Card with Attendance Progress
│       ├── StudentModal.tsx     # Add / Edit Student Form Modal
│       ├── StudentDetailModal.tsx # Detailed Student Profile View
│       ├── SchoolProfileModal.tsx # Edit School Profile Form
│       ├── EventModal.tsx       # Add School Event Modal
│       ├── NoticeModal.tsx      # Post School Announcement Modal
│       ├── AuthModal.tsx        # Firebase Auth Sign-in Modal
│       └── Toast.tsx            # Toast Notification Banners
```

---

## ⚙️ Environment Variables Setup

Configure `.env` or set secrets in the environment:

```env
# Required for Gemini AI Assistant
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Firebase Credentials (Auto-loaded from firebase-applet-config.json)
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
```

---

## 🚀 Running Locally & Building

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`.

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Start Production Node Server:**
   ```bash
   npm start
   ```

---

## 🌩️ Deployment to Firebase Hosting

To deploy rules and static assets to Firebase:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize & Deploy:**
   ```bash
   firebase deploy --only hosting,firestore:rules,storage
   ```

---

## 🔐 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} { allow read, write: if true; }
    match /attendance/{attendanceId} { allow read, write: if true; }
    match /schoolProfile/{profileId} { allow read, write: if true; }
    match /events/{eventId} { allow read, write: if true; }
    match /fees/{feeId} { allow read, write: if true; }
    match /announcements/{announcementId} { allow read, write: if true; }
    match /aiHistory/{chatId} { allow read, write: if true; }
  }
}
```

---

## ✅ Deployment & Verification Checklist

- [x] Full-stack architecture with server-side Gemini API proxy (`/api/ai/generate`).
- [x] Cloud Firestore database provisioned and connected with custom Database ID.
- [x] Complete CRUD operations for Students, Attendance, School Profile, Events, Fees, Announcements, and AI Chat.
- [x] Built-in AI Assistant with preset prompts for Lesson Plans, Quizzes, Parent Notices, and Activities.
- [x] Firebase Authentication with demo user accounts.
- [x] Production build passes cleanly (`npm run build`).
- [x] Firebase Hosting (`firebase.json`), Security Rules (`firestore.rules`, `storage.rules`) included.
