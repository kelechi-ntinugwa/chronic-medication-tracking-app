import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Placeholder config - User needs to replace this
const firebaseConfig = {
    apiKey: "AIzaSyBRhnqnZOE8B8wLsz6og6Ij64jlkHKrlqY",
    authDomain: "medication-b50ea.firebaseapp.com",
    projectId: "medication-b50ea",
    storageBucket: "medication-b50ea.firebasestorage.app",
    messagingSenderId: "186116798020",
    appId: "1:186116798020:web:19b48aa83a2165d237ae11",
    measurementId: "G-G53WW4WKVG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);




