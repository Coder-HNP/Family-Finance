import { useFirestore } from './useFirestore';
import { useAuth } from './useAuth';
import { DEFAULT_BUDGET_CATEGORIES } from '../utils/constants';

/**
 * Hook for budget management operations
 */
export const useBudget = () => {
    const { user } = useAuth();
    const { addDocument, updateDocument, deleteDocument, loading, error } = useFirestore('budgets', user?.uid);

    const createBudget = async (budgetData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await addDocument({
            ...budgetData,
            month: budgetData.month || new Date().toISOString().slice(0, 7), // YYYY-MM format
        });
    };

    const updateBudget = async (id, budgetData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await updateDocument(id, budgetData);
    };

    const deleteBudget = async (id) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        return await deleteDocument(id);
    };

    const initializeDefaultBudget = async () => {
        if (!user) return { success: false, error: 'User not authenticated' };

        const promises = DEFAULT_BUDGET_CATEGORIES.map(budget =>
            addDocument({
                ...budget,
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
