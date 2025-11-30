import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Seed sample data for a user account
 * This creates realistic demo data for testing
 */
export const seedUserData = async (userId) => {
    try {
        console.log('🌱 Seeding data for user:', userId);

        // Create user document
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, {
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
                currency: 'USD',
                theme: 'light',
            },
        }, { merge: true });

        // Sample transactions
        const transactions = [
            // Income
            { type: 'income', amount: 5000, category: 'Salary', date: '2024-11-01', notes: 'Monthly salary' },
            { type: 'income', amount: 500, category: 'Freelance', date: '2024-11-15', notes: 'Web design project' },
            { type: 'income', amount: 200, category: 'Investment', date: '2024-11-20', notes: 'Dividend payment' },

            // Expenses - Needs
            { type: 'expense', amount: 1200, category: 'Rent', date: '2024-11-01', notes: 'Monthly rent', expenseType: 'need' },
            { type: 'expense', amount: 300, category: 'Groceries', date: '2024-11-05', notes: 'Weekly groceries', expenseType: 'need' },
            { type: 'expense', amount: 150, category: 'Utilities', date: '2024-11-10', notes: 'Electricity bill', expenseType: 'need' },
            { type: 'expense', amount: 80, category: 'Transportation', date: '2024-11-12', notes: 'Gas', expenseType: 'need' },
            { type: 'expense', amount: 200, category: 'Healthcare', date: '2024-11-15', notes: 'Doctor visit', expenseType: 'need' },

            // Expenses - Wants
            { type: 'expense', amount: 60, category: 'Dining Out', date: '2024-11-08', notes: 'Restaurant dinner', expenseType: 'want' },
            { type: 'expense', amount: 100, category: 'Entertainment', date: '2024-11-14', notes: 'Movie tickets', expenseType: 'want' },
            { type: 'expense', amount: 50, category: 'Shopping', date: '2024-11-18', notes: 'Clothes', expenseType: 'want' },
            { type: 'expense', amount: 40, category: 'Subscriptions', date: '2024-11-20', notes: 'Netflix', expenseType: 'want' },

            // Expenses - Luxury
            { type: 'expense', amount: 300, category: 'Shopping', date: '2024-11-22', notes: 'Designer shoes', expenseType: 'luxury' },
            { type: 'expense', amount: 150, category: 'Entertainment', date: '2024-11-25', notes: 'Concert tickets', expenseType: 'luxury' },
        ];

        const transactionsRef = collection(userDocRef, 'transactions');
        for (const transaction of transactions) {
            await addDoc(transactionsRef, {
                ...transaction,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: userId,
            });
        }

        // Sample budgets
        const budgets = [
            { category: 'Groceries', limit: 400, month: '2024-11' },
            { category: 'Dining Out', limit: 200, month: '2024-11' },
            { category: 'Entertainment', limit: 150, month: '2024-11' },
            { category: 'Shopping', limit: 300, month: '2024-11' },
            { category: 'Transportation', limit: 200, month: '2024-11' },
        ];

        const budgetsRef = collection(userDocRef, 'budgets');
        for (const budget of budgets) {
            await addDoc(budgetsRef, {
                ...budget,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        // Sample savings goals
        const goals = [
            {
                name: 'Emergency Fund',
                targetAmount: 10000,
                currentAmount: 3500,
                deadline: '2025-12-31',
                category: 'Emergency',
            },
            {
                name: 'Vacation',
                targetAmount: 3000,
                currentAmount: 1200,
                deadline: '2025-06-30',
                category: 'Travel',
            },
            {
                name: 'New Laptop',
                targetAmount: 1500,
                currentAmount: 800,
                deadline: '2025-03-31',
                category: 'Electronics',
            },
        ];

        const goalsRef = collection(userDocRef, 'savingsGoals');
        for (const goal of goals) {
            await addDoc(goalsRef, {
                ...goal,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        // Sample recurring payments
        const recurring = [
            {
                name: 'Netflix Subscription',
                amount: 15,
                frequency: 'monthly',
                category: 'Subscriptions',
                nextDate: '2024-12-01',
                type: 'expense',
                expenseType: 'want',
            },
            {
                name: 'Gym Membership',
                amount: 50,
                frequency: 'monthly',
                category: 'Health',
                nextDate: '2024-12-01',
                type: 'expense',
                expenseType: 'want',
            },
            {
                name: 'Car Insurance',
                amount: 120,
                frequency: 'monthly',
                category: 'Insurance',
                nextDate: '2024-12-01',
                type: 'expense',
                expenseType: 'need',
            },
        ];

        const recurringRef = collection(userDocRef, 'recurringPayments');
        for (const payment of recurring) {
            await addDoc(recurringRef, {
                ...payment,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        // Sample bill reminders
        const reminders = [
            {
                name: 'Credit Card Payment',
                amount: 500,
                dueDate: '2024-12-05',
                category: 'Bills',
                isPaid: false,
            },
            {
                name: 'Internet Bill',
                amount: 60,
                dueDate: '2024-12-10',
                category: 'Utilities',
                isPaid: false,
            },
            {
                name: 'Phone Bill',
                amount: 40,
                dueDate: '2024-12-15',
                category: 'Utilities',
                isPaid: false,
            },
        ];

        const remindersRef = collection(userDocRef, 'billReminders');
        for (const reminder of reminders) {
            await addDoc(remindersRef, {
                ...reminder,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        console.log('✅ Sample data seeded successfully!');
        return { success: true, message: 'Sample data created successfully' };
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Clear all user data (for testing)
 */
export const clearUserData = async (userId) => {
    // Note: This would require batch deletes
    // For now, just log a warning
    console.warn('Clear user data not implemented - delete collections manually from Firebase Console');
    return { success: false, message: 'Not implemented' };
};
