import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useState } from 'react';

/**
 * Generic Firestore CRUD operations hook
 */
export const useFirestore = (collectionName) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addDocument = async (data) => {
        try {
            setLoading(true);
            setError(null);
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            setLoading(false);
            return { success: true, id: docRef.id };
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    const updateDocument = async (id, data) => {
        try {
            setLoading(true);
            setError(null);
            await updateDoc(doc(db, collectionName, id), {
                ...data,
                updatedAt: new Date().toISOString(),
            });
            setLoading(false);
            return { success: true };
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    const deleteDocument = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await deleteDoc(doc(db, collectionName, id));
            setLoading(false);
            return { success: true };
        } catch (err) {
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
