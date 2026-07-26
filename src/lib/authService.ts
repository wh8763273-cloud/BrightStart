import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { AppUser } from '../types';

export function subscribeToAuth(callback: (user: AppUser | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const appUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'principal@brightstart.edu',
        displayName: firebaseUser.displayName || 'Principal Sarah Miller',
        role: firebaseUser.email?.includes('teacher') ? 'Teacher' : 'Principal',
        photoURL: firebaseUser.photoURL || undefined
      };
      callback(appUser);
    } else {
      callback(null);
    }
  });
}

export async function loginAsDemoUser(role: 'Principal' | 'Teacher' = 'Principal'): Promise<AppUser> {
  const email = role === 'Principal' ? 'principal.sarah@brightstart.edu' : 'teacher.alex@brightstart.edu';
  const password = 'DemoPassword123!';
  const displayName = role === 'Principal' ? 'Principal Sarah Miller' : 'Teacher Alex';

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: cred.user.uid,
      email: cred.user.email!,
      displayName: cred.user.displayName || displayName,
      role
    };
  } catch (err: any) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      // Create user if doesn't exist
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName });
      }
      return {
        uid: cred.user.uid,
        email: cred.user.email!,
        displayName,
        role
      };
    }
    // Fallback to active local state if Firebase Auth offline
    return {
      uid: 'demo-local-id',
      email,
      displayName,
      role
    };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
}
