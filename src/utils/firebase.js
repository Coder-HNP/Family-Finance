// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// -----------------------------
// 🔥 Firebase Configuration from Environment Variables
// -----------------------------
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that all required environment variables are present
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missingVars);
    console.error('Please check your .env file and ensure all VITE_FIREBASE_* variables are set.');
}

// -----------------------------
// 🚀 Initialize Firebase
// -----------------------------
const app = initializeApp(firebaseConfig);

// -----------------------------
// 🔐 Authentication
// -----------------------------
const auth = getAuth(app);

// Google Login Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account",
});

// -----------------------------
// 📦 Firestore Database
// -----------------------------
const db = getFirestore(app);

// -----------------------------
// 📊 Analytics (works only in HTTPS / production)
// -----------------------------
let analytics = null;

isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
});

// -----------------------------
// 📤 Export everything
// -----------------------------
export { app, auth, db, googleProvider, analytics };
