import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import fallbackConfig from '../firebase-applet-config.json';

/**
 * Firebase konfiguratsiyasi.
 * Yangi loyiha uchun .env.local ga VITE_FIREBASE_* o'zgaruvchilarini kiriting.
 * Agar env berilmasa, firebase-applet-config.json fallback sifatida ishlatiladi.
 */
const env = import.meta.env;

const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY            ?? fallbackConfig.apiKey,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN        ?? fallbackConfig.authDomain,
  projectId:         env.VITE_FIREBASE_PROJECT_ID         ?? fallbackConfig.projectId,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET     ?? fallbackConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? fallbackConfig.messagingSenderId,
  appId:             env.VITE_FIREBASE_APP_ID             ?? fallbackConfig.appId,
  measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID     ?? (fallbackConfig as any).measurementId,
};

// Maxsus baza ID kerak bo'lsa .env.local ga VITE_FIREBASE_FIRESTORE_DB_ID qo'shing.
// Yangi Firebase loyihalari doim "(default)" bazasidan foydalanadi.
const firestoreDatabaseId = env.VITE_FIREBASE_FIRESTORE_DB_ID ?? '(default)';

// Vite HMR paytida takroriy initializeApp xatosini oldini olish
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// getFirestore — initializeFirestore ga nisbatan HMR xavfsiz va
// experimentalForceLongPolling kabi tajribaviy bayroqlarsiz ishlaydi.
export const db      = getFirestore(app, firestoreDatabaseId);
export const auth    = getAuth(app);
export const storage = getStorage(app);
