import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';

/**
 * Hook for recurring payments operations
 */
export const useRecurring = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('recurringPayments', user?.uid);

    const addRecurringPayment = async (paymentData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await addDocument({
            ...paymentData,
            nextDate: paymentData.nextDate || new Date().toISOString().slice(0, 10),
            isActive: true,
        });
    };

    const updateRecurringPayment = async (id, paymentData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, paymentData);
    };

    const deleteRecurringPayment = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await deleteDocument(id);
    };

    const toggleRecurringPayment = async (id, isActive) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, { isActive });
    };

    return {
        addRecurringPayment,
        updateRecurringPayment,
        deleteRecurringPayment,
        toggleRecurringPayment,
        loading,
        error,
    };
};

export default useRecurring;
