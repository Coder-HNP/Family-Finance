import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';

/**
 * Hook for savings goals operations
 */
export const useGoals = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('savingsGoals', user?.uid);

    const addGoal = async (goalData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await addDocument({
            ...goalData,
            currentAmount: goalData.currentAmount || 0,
            isCompleted: false,
        });
    };

    const updateGoal = async (id, goalData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, goalData);
    };

    const deleteGoal = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await deleteDocument(id);
    };

    const addToGoal = async (id, amount) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        // Note: This should use Firestore increment in production
        // For now, we'll handle it in the component
        return { success: true, message: 'Use updateGoal with new currentAmount' };
    };

    const completeGoal = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, {
            isCompleted: true,
            completedAt: new Date().toISOString(),
        });
    };

    return {
        addGoal,
        updateGoal,
        deleteGoal,
        addToGoal,
        completeGoal,
        loading,
        error,
    };
};

export default useGoals;
