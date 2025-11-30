// Application constants

export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
};

export const EXPENSE_TYPES = {
    NEED: 'need',
    WANT: 'want',
    LUXURY: 'luxury',
};

export const INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Rental',
    'Gift',
    'Other',
];

export const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Groceries',
    'Transportation',
    'Utilities',
    'Healthcare',
    'Education',
    'Entertainment',
    'Shopping',
    'Travel',
    'Insurance',
    'Rent/Mortgage',
    'Personal Care',
    'Gifts & Donations',
    'Subscriptions',
    'Other',
];

export const RECURRING_FREQUENCIES = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
];

export const CHART_COLORS = {
    income: '#22c55e',
    expense: '#ef4444',
    need: '#3b82f6',
    want: '#f59e0b',
    luxury: '#a855f7',
    savings: '#10b981',
};

export const CATEGORY_COLORS = [
    '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#6366f1', '#f97316', '#14b8a6', '#ef4444', '#84cc16',
    '#06b6d4', '#a855f7', '#eab308', '#22c55e', '#f43f5e',
];

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export const INSIGHT_THRESHOLDS = {
    OVERSPENDING_PERCENTAGE: 10, // Alert if spending is 10% over budget
    LOW_SAVINGS_RATE: 20, // Alert if savings rate is below 20%
    HIGH_LUXURY_PERCENTAGE: 30, // Alert if luxury spending is over 30%
    CATEGORY_SPIKE_PERCENTAGE: 50, // Alert if category spending increases by 50%
};

export const DEFAULT_BUDGET_CATEGORIES = EXPENSE_CATEGORIES.map(category => ({
    category,
    limit: 0,
}));

export const FAMILY_ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer',
};

export const NOTIFICATION_TYPES = {
    OVERSPENDING: 'overspending',
    BILL_REMINDER: 'bill_reminder',
    GOAL_ACHIEVED: 'goal_achieved',
    BUDGET_ALERT: 'budget_alert',
    RECURRING_PAYMENT: 'recurring_payment',
};
