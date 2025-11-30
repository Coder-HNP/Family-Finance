import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';

/**
 * Hook for transaction-specific operations
 */
export const useTransactions = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('transactions', user?.uid);

    const addTransaction = async (transactionData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        // No need to add userId to data - it's implicit in the subcollection path
        return await addDocument(transactionData);
    };

    const updateTransaction = async (id, transactionData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, transactionData);
    };

    const deleteTransaction = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await deleteDocument(id);
    };

    return {
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loading,
        error,
    };
};

export default useTransactions;
