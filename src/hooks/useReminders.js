import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';

/**
 * Hook for bill reminders operations
 */
export const useReminders = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('billReminders', user?.uid);

    const addReminder = async (reminderData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await addDocument({
            ...reminderData,
            isPaid: false,
            notified: false,
        });
    };

    const updateReminder = async (id, reminderData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, reminderData);
    };

    const deleteReminder = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await deleteDocument(id);
    };

    const markAsPaid = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, {
            isPaid: true,
            paidAt: new Date().toISOString(),
        });
    };

    const markAsUnpaid = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, {
            isPaid: false,
            paidAt: null,
        });
    };

    return {
        addReminder,
        updateReminder,
        deleteReminder,
        markAsPaid,
        markAsUnpaid,
        loading,
        error,
    };
};

export default useReminders;
