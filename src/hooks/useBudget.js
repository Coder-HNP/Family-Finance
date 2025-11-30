import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';
import { DEFAULT_BUDGET_CATEGORIES } from '../utils/constants';

/**
 * Hook for budget management operations
 */
export const useBudget = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('budgets');

    const createBudget = async (budgetData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await addDocument({
            ...budgetData,
            userId: user.uid,
            month: budgetData.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
        });
    };

    const updateBudget = async (id, budgetData) => {
        return await updateDocument(id, budgetData);
    };

    const deleteBudget = async (id) => {
        return await deleteDocument(id);
    };

    const initializeDefaultBudget = async () => {
        if (!user) return { success: false, error: 'User not authenticated' };

        const promises = DEFAULT_BUDGET_CATEGORIES.map(budget =>
            addDocument({
                ...budget,
                userId: user.uid,
                month: new Date().toISOString().slice(0, 7),
            })
        );

        try {
            await Promise.all(promises);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        createBudget,
        updateBudget,
        deleteBudget,
        initializeDefaultBudget,
        loading,
        error,
    };
};

export default useBudget;
