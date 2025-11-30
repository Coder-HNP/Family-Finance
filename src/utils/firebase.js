// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// -----------------------------
// 🔥 Your Firebase Credentials
// -----------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCJVqN2KD2hkzrUO0lhOA53UmuII4FrgII",
    authDomain: "finance-tracker-203ab.firebaseapp.com",
    projectId: "finance-tracker-203ab",
    storageBucket: "finance-tracker-203ab.firebasestorage.app",
    messagingSenderId: "159841303722",
    appId: "1:159841303722:web:524754ae6b8637ca7a24d3",
    measurementId: "G-2L78ME32DV",
};

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
