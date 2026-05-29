// Firebase configuration & initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDz963HU8mDeGeGeaInqQXcNUN4bd72JK0",
  authDomain: "thikana-pune.firebaseapp.com",
  projectId: "thikana-pune",
  storageBucket: "thikana-pune.firebasestorage.app",
  messagingSenderId: "339613163640",
  appId: "1:339613163640:web:d8047520d842e999098d8d",
  measurementId: "G-WP5MPNBHE9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const analytics = getAnalytics(app);
export const db        = getFirestore(app);
export const auth      = getAuth(app);
export const storage   = getStorage(app);

export default app;
