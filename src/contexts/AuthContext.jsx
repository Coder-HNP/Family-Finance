import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../utils/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Get additional user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setUser({
                    ...user,
                    ...userDoc.data(),
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, displayName) => {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            await updateProfile(result.user, { displayName });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', result.user.uid), {
                email,
                displayName,
                createdAt: new Date().toISOString(),
                familyId: null,
                role: 'admin',
            });

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const loginWithGoogle = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);

            // Check if user document exists, if not create one
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    createdAt: new Date().toISOString(),
                    familyId: null,
                    role: 'admin',
                });
            }

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
