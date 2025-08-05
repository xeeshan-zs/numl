import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1bhnY-fsmFv6N6bs5jHJuDTVv3LgdRGQ",
  authDomain: "portal-numl.firebaseapp.com",
  projectId: "portal-numl",
  storageBucket: "portal-numl.firebasestorage.app",
  messagingSenderId: "1071736263851",
  appId: "1:1071736263851:web:b5edd04e9893fbf67993ee",
  measurementId: "G-N372BKVZF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
