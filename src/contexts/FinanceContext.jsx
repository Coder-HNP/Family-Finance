import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc } from 'firebase/firestore';
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
    const [error, setError] = useState(null);

    // Subscribe to transactions (per-user subcollection)
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        try {
            // Using subcollection: users/{uid}/transactions
            const userDocRef = doc(db, 'users', user.uid);
            const transactionsRef = collection(userDocRef, 'transactions');
            const q = query(transactionsRef, orderBy('date', 'desc'));

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTransactions(data);
                    setLoading(false);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching transactions:', err);
                    setError(`Failed to load transactions: ${err.message}`);
                    setLoading(false);
                }
            );

            return unsubscribe;
        } catch (err) {
            console.error('Error setting up transactions listener:', err);
            setError(`Failed to initialize transactions: ${err.message}`);
            setLoading(false);
        }
    }, [user]);

    // Subscribe to budgets (per-user subcollection)
    useEffect(() => {
        if (!user) {
            setBudgets([]);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const budgetsRef = collection(userDocRef, 'budgets');
            const q = query(budgetsRef);

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setBudgets(data);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching budgets:', err);
                    setError(`Failed to load budgets: ${err.message}`);
                }
            );

            return unsubscribe;
        } catch (err) {
            console.error('Error setting up budgets listener:', err);
            setError(`Failed to initialize budgets: ${err.message}`);
        }
    }, [user]);

    // Subscribe to recurring payments (per-user subcollection)
    useEffect(() => {
        if (!user) {
            setRecurringPayments([]);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const recurringRef = collection(userDocRef, 'recurringPayments');
            const q = query(recurringRef, orderBy('nextDate', 'asc'));

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setRecurringPayments(data);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching recurring payments:', err);
                    setError(`Failed to load recurring payments: ${err.message}`);
                }
            );

            return unsubscribe;
        } catch (err) {
            console.error('Error setting up recurring payments listener:', err);
            setError(`Failed to initialize recurring payments: ${err.message}`);
        }
    }, [user]);

    // Subscribe to savings goals (per-user subcollection)
    useEffect(() => {
        if (!user) {
            setSavingsGoals([]);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const goalsRef = collection(userDocRef, 'savingsGoals');
            const q = query(goalsRef);

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setSavingsGoals(data);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching savings goals:', err);
                    setError(`Failed to load savings goals: ${err.message}`);
                }
            );

            return unsubscribe;
        } catch (err) {
            console.error('Error setting up savings goals listener:', err);
            setError(`Failed to initialize savings goals: ${err.message}`);
        }
    }, [user]);

    // Subscribe to bill reminders (per-user subcollection)
    useEffect(() => {
        if (!user) {
            setBillReminders([]);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const remindersRef = collection(userDocRef, 'billReminders');
            const q = query(remindersRef, orderBy('dueDate', 'asc'));

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setBillReminders(data);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching bill reminders:', err);
                    setError(`Failed to load bill reminders: ${err.message}`);
                }
            );

            return unsubscribe;
        } catch (err) {
            console.error('Error setting up bill reminders listener:', err);
            setError(`Failed to initialize bill reminders: ${err.message}`);
        }
    }, [user]);

    const value = {
        transactions,
        budgets,
        recurringPayments,
        savingsGoals,
        billReminders,
        loading,
        error,
    };

    return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export default FinanceContext;
