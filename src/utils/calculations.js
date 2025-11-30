import { TRANSACTION_TYPES, EXPENSE_TYPES, INSIGHT_THRESHOLDS } from './constants';
import { isCurrentMonth, isCurrentYear, getMonthName, getYear } from './dateHelpers';

/**
 * Calculate total amount for transactions
 */
export const calculateTotal = (transactions) => {
    return transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
};

/**
 * Filter transactions by type
 */
export const filterByType = (transactions, type) => {
    return transactions.filter(t => t.type === type);
};

/**
 * Filter transactions by expense type
 */
export const filterByExpenseType = (transactions, expenseType) => {
    return transactions.filter(t => t.type === TRANSACTION_TYPES.EXPENSE && t.expenseType === expenseType);
};

/**
 * Filter transactions by category
 */
export const filterByCategory = (transactions, category) => {
    return transactions.filter(t => t.category === category);
};

/**
 * Filter transactions by date range
 */
export const filterByDateRange = (transactions, startDate, endDate) => {
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });
};

/**
 * Get current month transactions
 */
export const getCurrentMonthTransactions = (transactions) => {
    return transactions.filter(t => isCurrentMonth(t.date));
};

/**
 * Get current year transactions
 */
export const getCurrentYearTransactions = (transactions) => {
    return transactions.filter(t => isCurrentYear(t.date));
};

/**
 * Calculate income and expense totals
 */
export const calculateIncomeExpense = (transactions) => {
    const income = calculateTotal(filterByType(transactions, TRANSACTION_TYPES.INCOME));
    const expense = calculateTotal(filterByType(transactions, TRANSACTION_TYPES.EXPENSE));
    const savings = income - expense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    return { income, expense, savings, savingsRate };
};

/**
 * Calculate category-wise breakdown
 */
export const calculateCategoryBreakdown = (transactions) => {
    const categoryMap = {};

    transactions.forEach(transaction => {
        const { category, amount } = transaction;
        if (!categoryMap[category]) {
            categoryMap[category] = 0;
        }
        categoryMap[category] += Number(amount);
    });

    return Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount,
    }));
};

/**
 * Calculate Need/Want/Luxury distribution
 */
export const calculateExpenseTypeDistribution = (transactions) => {
    const expenses = filterByType(transactions, TRANSACTION_TYPES.EXPENSE);

    const need = calculateTotal(filterByExpenseType(expenses, EXPENSE_TYPES.NEED));
    const want = calculateTotal(filterByExpenseType(expenses, EXPENSE_TYPES.WANT));
    const luxury = calculateTotal(filterByExpenseType(expenses, EXPENSE_TYPES.LUXURY));
    const total = need + want + luxury;

    return {
        need,
        want,
        luxury,
        total,
        needPercentage: total > 0 ? ((need / total) * 100).toFixed(1) : 0,
        wantPercentage: total > 0 ? ((want / total) * 100).toFixed(1) : 0,
        luxuryPercentage: total > 0 ? ((luxury / total) * 100).toFixed(1) : 0,
    };
};

/**
 * Calculate monthly trends
 */
export const calculateMonthlyTrends = (transactions) => {
    const monthlyData = {};

    transactions.forEach(transaction => {
        const monthYear = `${getMonthName(transaction.date)} ${getYear(transaction.date)}`;

        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                month: monthYear,
                income: 0,
                expense: 0,
            };
        }

        if (transaction.type === TRANSACTION_TYPES.INCOME) {
            monthlyData[monthYear].income += Number(transaction.amount);
        } else {
            monthlyData[monthYear].expense += Number(transaction.amount);
        }
    });

    return Object.values(monthlyData).map(data => ({
        ...data,
        savings: data.income - data.expense,
    }));
};

/**
 * Generate overspending insights
 */
export const generateOverspendingInsights = (transactions, budgets) => {
    const insights = [];
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const expenses = filterByType(currentMonthTransactions, TRANSACTION_TYPES.EXPENSE);

    budgets.forEach(budget => {
        const categoryExpenses = filterByCategory(expenses, budget.category);
        const spent = calculateTotal(categoryExpenses);

        if (spent > budget.limit) {
            const overspent = spent - budget.limit;
            const percentage = ((overspent / budget.limit) * 100).toFixed(1);

            insights.push({
                type: 'overspending',
                category: budget.category,
                message: `You've overspent on ${budget.category} by $${overspent.toFixed(2)} (${percentage}% over budget)`,
                severity: percentage > 50 ? 'high' : percentage > 20 ? 'medium' : 'low',
            });
        } else if (spent > budget.limit * 0.9) {
            const remaining = budget.limit - spent;
            insights.push({
                type: 'warning',
                category: budget.category,
                message: `You're close to your ${budget.category} budget limit. Only $${remaining.toFixed(2)} remaining.`,
                severity: 'medium',
            });
        }
    });

    return insights;
};

/**
 * Generate savings rate insights
 */
export const generateSavingsInsights = (transactions) => {
    const currentMonth = getCurrentMonthTransactions(transactions);
    const { income, expense, savingsRate } = calculateIncomeExpense(currentMonth);

    const insights = [];

    if (savingsRate < INSIGHT_THRESHOLDS.LOW_SAVINGS_RATE) {
        insights.push({
            type: 'savings',
            message: `Your savings rate is ${savingsRate}%. Consider reducing expenses to save more.`,
            severity: 'high',
        });
    } else if (savingsRate >= 30) {
        insights.push({
            type: 'savings',
            message: `Great job! You're saving ${savingsRate}% of your income.`,
            severity: 'positive',
        });
    }

    return insights;
};

/**
 * Generate expense type pattern insights
 */
export const generateExpenseTypeInsights = (transactions) => {
    const currentMonth = getCurrentMonthTransactions(transactions);
    const distribution = calculateExpenseTypeDistribution(currentMonth);
    const insights = [];

    if (distribution.luxuryPercentage > INSIGHT_THRESHOLDS.HIGH_LUXURY_PERCENTAGE) {
        insights.push({
            type: 'pattern',
            message: `${distribution.luxuryPercentage}% of your expenses are on luxury items. Consider cutting back.`,
            severity: 'medium',
        });
    }

    if (distribution.needPercentage < 40) {
        insights.push({
            type: 'pattern',
            message: `Only ${distribution.needPercentage}% of expenses are on needs. Review your spending priorities.`,
            severity: 'medium',
        });
    }

    return insights;
};

/**
 * Generate category spike alerts
 */
export const generateCategoryAlerts = (transactions) => {
    const currentMonth = getCurrentMonthTransactions(transactions);
    const previousMonth = transactions.filter(t => {
        const date = new Date(t.date);
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return date >= lastMonth && date <= lastMonthEnd;
    });

    const currentCategories = calculateCategoryBreakdown(filterByType(currentMonth, TRANSACTION_TYPES.EXPENSE));
    const previousCategories = calculateCategoryBreakdown(filterByType(previousMonth, TRANSACTION_TYPES.EXPENSE));

    const insights = [];

    currentCategories.forEach(current => {
        const previous = previousCategories.find(p => p.category === current.category);

        if (previous && previous.amount > 0) {
            const increase = ((current.amount - previous.amount) / previous.amount) * 100;

            if (increase > INSIGHT_THRESHOLDS.CATEGORY_SPIKE_PERCENTAGE) {
                insights.push({
                    type: 'category_alert',
                    category: current.category,
                    message: `${current.category} spending increased by ${increase.toFixed(1)}% compared to last month.`,
                    severity: 'medium',
                });
            }
        }
    });

    return insights;
};

/**
 * Generate all smart insights
 */
export const generateAllInsights = (transactions, budgets = []) => {
    return [
        ...generateOverspendingInsights(transactions, budgets),
        ...generateSavingsInsights(transactions),
        ...generateExpenseTypeInsights(transactions),
        ...generateCategoryAlerts(transactions),
    ];
};

/**
 * Calculate budget progress
 */
export const calculateBudgetProgress = (transactions, budgets) => {
    const currentMonth = getCurrentMonthTransactions(transactions);
    const expenses = filterByType(currentMonth, TRANSACTION_TYPES.EXPENSE);

    return budgets.map(budget => {
        const categoryExpenses = filterByCategory(expenses, budget.category);
        const spent = calculateTotal(categoryExpenses);
        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        return {
            ...budget,
            spent,
            remaining: budget.limit - spent,
            percentage: Math.min(percentage, 100),
            status: percentage >= 100 ? 'exceeded' : percentage >= 90 ? 'warning' : 'good',
        };
    });
};

/**
 * Placeholder: Predict next month's expenses using simple average
 */
export const predictExpenses = (transactions) => {
    const last3Months = transactions.filter(t => {
        const date = new Date(t.date);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return date >= threeMonthsAgo && t.type === TRANSACTION_TYPES.EXPENSE;
    });

    const categoryAverages = {};
    const categoryMap = calculateCategoryBreakdown(last3Months);

    categoryMap.forEach(({ category, amount }) => {
        categoryAverages[category] = amount / 3; // Simple 3-month average
    });

    return {
        predictions: categoryAverages,
        totalPredicted: Object.values(categoryAverages).reduce((sum, val) => sum + val, 0),
        confidence: 'low', // Placeholder - would be higher with ML model
        method: 'simple_average',
    };
};

/**
 * Placeholder: AI-based spending insights
 */
export const generateAIInsights = (transactions) => {
    // This is a placeholder for AI-based insights
    // In production, this would call an ML model or AI API

    const insights = [];
    const { income, expense, savingsRate } = calculateIncomeExpense(getCurrentMonthTransactions(transactions));

    // Simple rule-based "AI" insights as placeholder
    if (savingsRate < 10) {
        insights.push({
            type: 'ai_recommendation',
            message: 'AI suggests: Your savings rate is low. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
            priority: 'high',
        });
    }

    const distribution = calculateExpenseTypeDistribution(getCurrentMonthTransactions(transactions));
    if (distribution.wantPercentage > 40) {
        insights.push({
            type: 'ai_recommendation',
            message: 'AI suggests: Your "want" expenses are high. Consider reducing by 10% to boost savings.',
            priority: 'medium',
        });
    }

    return insights;
};
