import { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { generateAllInsights } from '../utils/calculations';

/**
 * Hook for generating smart insights
 */
export const useInsights = () => {
    const { transactions, budgets } = useFinance();

    const insights = useMemo(() => {
        if (!transactions.length) return [];
        return generateAllInsights(transactions, budgets);
    }, [transactions, budgets]);

    const highPriorityInsights = useMemo(() => {
        return insights.filter(insight => insight.severity === 'high');
    }, [insights]);

    const mediumPriorityInsights = useMemo(() => {
        return insights.filter(insight => insight.severity === 'medium');
    }, [insights]);

    const positiveInsights = useMemo(() => {
        return insights.filter(insight => insight.severity === 'positive');
    }, [insights]);

    return {
        insights,
        highPriorityInsights,
        mediumPriorityInsights,
        positiveInsights,
        hasInsights: insights.length > 0,
    };
};

export default useInsights;
