import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC7obScxtZVErGJewuqzHUR1Ow_6EXzKZ8",
  authDomain: "feisty-proton-409908.firebaseapp.com",
  projectId: "feisty-proton-409908",
  storageBucket: "feisty-proton-409908.firebasestorage.app",
  messagingSenderId: "1078680947049",
  appId: "1:1078680947049:web:93372bf3ea3557c02ad5f8",
  measurementId: "G-4YXWFH606D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
