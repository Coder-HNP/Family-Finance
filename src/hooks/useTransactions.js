import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';

/**
 * Hook for transaction-specific operations
 */
export const useTransactions = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('transactions');

    const addTransaction = async (transactionData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await addDocument({
            ...transactionData,
            userId: user.uid,
            familyId: user.familyId || null,
        });
    };

    const updateTransaction = async (id, transactionData) => {
        return await updateDocument(id, transactionData);
    };

    const deleteTransaction = async (id) => {
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
