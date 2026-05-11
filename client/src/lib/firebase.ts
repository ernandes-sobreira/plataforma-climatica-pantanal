import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Prevent re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export const isFirebaseConfigured = (): boolean => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
};

export const initAuth = (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!isFirebaseConfigured()) {
      resolve(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user.uid);
        } catch (e) {
          console.warn('Firebase anonymous auth failed:', e);
          resolve(null);
        }
      }
    });
  });
};

export const getCurrentUserId = (): string => {
  return auth.currentUser?.uid ?? 'anonymous-' + Math.random().toString(36).slice(2);
};
