import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import fallbackConfig from '../firebase-applet-config.json';

/**
 * Firebase konfiguratsiyasi.
 *
 * Yangi Firebase loyihasiga ulanish uchun loyiha ildizidagi `.env.local`
 * faylida quyidagi o'zgaruvchilarni to'ldiring (namuna: `.env.example`):
 *
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 *   VITE_FIREBASE_MEASUREMENT_ID      (ixtiyoriy)
 *   VITE_FIREBASE_FIRESTORE_DB_ID     (ixtiyoriy, sukut bo'yicha "(default)")
 *
 * Agar env o'zgaruvchilari berilmasa, eski `firebase-applet-config.json`
 * faylidagi qiymatlar ishlatiladi (orqaga moslik uchun).
 */
const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? fallbackConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? fallbackConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? fallbackConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? fallbackConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? fallbackConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID ?? fallbackConfig.appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? (fallbackConfig as any).measurementId,
};

// Yangi Firebase loyihalarida Firestore doim "(default)" bazasidan foydalanadi.
// Maxsus baza ID kerak bo'lsa VITE_FIREBASE_FIRESTORE_DB_ID ni .env.local ga qo'shing.
// Eslatma: fallbackConfig.firestoreDatabaseId ishlatilmaydi — u BOSHQA loyihaga tegishli.
const firestoreDatabaseId = env.VITE_FIREBASE_FIRESTORE_DB_ID ?? '(default)';

const app = initializeApp(firebaseConfig);

// experimentalForceLongPolling — sandbox/proksili muhitlarda
// "Could not reach Cloud Firestore backend" xatosini bartaraf etadi.
export const db = initializeFirestore(
  app,
  { experimentalForceLongPolling: true },
  firestoreDatabaseId,
);

export const auth = getAuth(app);
export const storage = getStorage(app);
