import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useState } from 'react';

/**
 * Generic Firestore CRUD operations hook for per-user subcollections
 * @param {string} collectionName - Name of the subcollection (e.g., 'transactions', 'budgets')
 * @param {string} userId - User ID for the parent document
 */
export const useFirestore = (collectionName, userId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addDocument = async (data) => {
        if (!userId) {
            const error = 'User ID is required';
            setError(error);
            return { success: false, error };
        }

        try {
            setLoading(true);
            setError(null);

            // Reference to user's subcollection: users/{userId}/{collectionName}
            const userDocRef = doc(db, 'users', userId);
            const collectionRef = collection(userDocRef, collectionName);

            const docRef = await addDoc(collectionRef, {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: userId,
            });

            setLoading(false);
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error(`Error adding document to ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    const updateDocument = async (id, data) => {
        if (!userId) {
            const error = 'User ID is required';
            setError(error);
            return { success: false, error };
        }

        try {
            setLoading(true);
            setError(null);

            // Reference to specific document in user's subcollection
            const userDocRef = doc(db, 'users', userId);
            const docRef = doc(collection(userDocRef, collectionName), id);

            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString(),
            });

            setLoading(false);
            return { success: true };
        } catch (err) {
            console.error(`Error updating document in ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    const deleteDocument = async (id) => {
        if (!userId) {
            const error = 'User ID is required';
            setError(error);
            return { success: false, error };
        }

        try {
            setLoading(true);
            setError(null);

            // Reference to specific document in user's subcollection
            const userDocRef = doc(db, 'users', userId);
            const docRef = doc(collection(userDocRef, collectionName), id);

            await deleteDoc(docRef);

            setLoading(false);
            return { success: true };
        } catch (err) {
            console.error(`Error deleting document from ${collectionName}:`, err);
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    return {
        addDocument,
        updateDocument,
        deleteDocument,
        loading,
        error,
    };
};

export default useFirestore;
