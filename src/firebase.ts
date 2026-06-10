import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase — cv-rasmiyatchi loyihasi.
 *
 * Web (client) konfiguratsiyasi maxfiy emas — u baribir tayyor JS bundle
 * ichida bo'ladi, shuning uchun to'g'ridan-to'g'ri shu yerda turibdi.
 * Agar kerak bo'lsa, .env.local dagi VITE_FIREBASE_* o'zgaruvchilari ustun keladi.
 *
 * MUHIM: `||` ishlatilgan (`??` emas) — bo'sh satr ("") ham standart qiymatga
 * o'tishi uchun. Aks holda bo'sh env qiymati noto'g'ri konfiguratsiyaga olib keladi.
 */
const env = import.meta.env;

const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY             || 'AIzaSyBwI19vyaYzLbE-prTpJ23XXrR8dNdKHSk',
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN         || 'cv-rasmiyatchi.firebaseapp.com',
  projectId:         env.VITE_FIREBASE_PROJECT_ID          || 'cv-rasmiyatchi',
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET      || 'cv-rasmiyatchi.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '75352947133',
  appId:             env.VITE_FIREBASE_APP_ID              || '1:75352947133:web:9d920386624393d9233ad4',
  measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID      || 'G-KN3YJ1S0D4',
};

// Vite HMR paytida takroriy initializeApp xatosini oldini olish.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Yangi Firebase loyihasi doim standart "(default)" Firestore bazasidan foydalanadi.
// Hech qachon getFirestore(app, customId) chaqirilmaydi — bu yozish/o'qish xatolarining oldini oladi.
export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);
