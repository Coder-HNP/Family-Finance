import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from './AuthContext';

const FinanceContext = createContext({});

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within FinanceProvider');
    }
    return context;
};

export const FinanceProvider = ({ children }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [recurringPayments, setRecurringPayments] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [billReminders, setBillReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to transactions
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTransactions(data);
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    // Subscribe to budgets
    useEffect(() => {
        if (!user) {
            setBudgets([]);
            return;
        }

        const q = query(
            collection(db, 'budgets'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBudgets(data);
        });

        return unsubscribe;
    }, [user]);

    // Subscribe to recurring payments
    useEffect(() => {
        if (!user) {
            setRecurringPayments([]);
            return;
        }

        const q = query(
            collection(db, 'recurringPayments'),
            where('userId', '==', user.uid),
            orderBy('nextDate', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRecurringPayments(data);
        });

        return unsubscribe;
    }, [user]);

    // Subscribe to savings goals
    useEffect(() => {
        if (!user) {
            setSavingsGoals([]);
            return;
        }

        const q = query(
            collection(db, 'savingsGoals'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSavingsGoals(data);
        });

        return unsubscribe;
    }, [user]);

    // Subscribe to bill reminders
    useEffect(() => {
        if (!user) {
            setBillReminders([]);
            return;
        }

        const q = query(
            collection(db, 'billReminders'),
            where('userId', '==', user.uid),
            orderBy('dueDate', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBillReminders(data);
        });

        return unsubscribe;
    }, [user]);

    const value = {
        transactions,
        budgets,
        recurringPayments,
        savingsGoals,
        billReminders,
        loading,
    };

    return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export default FinanceContext;
