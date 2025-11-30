import React, { useMemo, useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useAuth } from '../hooks/useAuth';
import {
    calculateIncomeExpense,
    getCurrentMonthTransactions,
    calculateExpenseTypeDistribution
} from '../utils/calculations';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TransactionForm from '../components/transactions/TransactionForm';

const Dashboard = () => {
    const { user } = useAuth();
    const { transactions, loading } = useFinance();
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [transactionType, setTransactionType] = useState('expense');

    const currentMonthData = useMemo(() => {
        const currentMonth = getCurrentMonthTransactions(transactions);
        return calculateIncomeExpense(currentMonth);
    }, [transactions]);

    const expenseDistribution = useMemo(() => {
        const currentMonth = getCurrentMonthTransactions(transactions);
        return calculateExpenseTypeDistribution(currentMonth);
    }, [transactions]);

    const recentTransactions = useMemo(() => {
        return transactions.slice(0, 5);
    }, [transactions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const handleAddTransaction = (type) => {
        setTransactionType(type);
        setShowAddTransaction(true);
    };

    return (
        <div className="content-container pb-20 lg:pb-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    Welcome back, {user?.displayName || 'User'}! 👋
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Here's your financial overview for this month
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Button
                    variant="success"
                    className="w-full"
                    icon={Plus}
                    onClick={() => handleAddTransaction('income')}
                >
                    Add Income
                </Button>
                <Button
                    variant="danger"
                    className="w-full"
                    icon={Plus}
                    onClick={() => handleAddTransaction('expense')}
                >
                    Add Expense
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Income */}
                <div className="stat-card bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200 dark:border-success-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-success-700 dark:text-success-300">
                            Total Income
                        </span>
                        <TrendingUp className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-3xl font-bold text-success-900 dark:text-success-100">
                        ${currentMonthData.income.toFixed(2)}
                    </p>
                </div>

                {/* Total Expenses */}
                <div className="stat-card bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200 dark:border-danger-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-danger-700 dark:text-danger-300">
                            Total Expenses
                        </span>
                        <TrendingDown className="w-5 h-5 text-danger-600" />
                    </div>
                    <p className="text-3xl font-bold text-danger-900 dark:text-danger-100">
                        ${currentMonthData.expense.toFixed(2)}
                    </p>
                </div>

                {/* Net Savings */}
                <div className="stat-card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                            Net Savings
                        </span>
                        <PiggyBank className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
                        ${currentMonthData.savings.toFixed(2)}
                    </p>
                </div>

                {/* Savings Rate */}
                <div className="stat-card bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 border-warning-200 dark:border-warning-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-warning-700 dark:text-warning-300">
                            Savings Rate
                        </span>
                        <Wallet className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-3xl font-bold text-warning-900 dark:text-warning-100">
                        {currentMonthData.savingsRate}%
                    </p>
                </div>
            </div>

            {/* Expense Distribution */}
            <div className="card p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="text-sm text-primary-700 dark:text-primary-300 mb-1">Needs</p>
                        <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                            {expenseDistribution.needPercentage}%
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                            ${expenseDistribution.need.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                        <p className="text-sm text-warning-700 dark:text-warning-300 mb-1">Wants</p>
                        <p className="text-2xl font-bold text-warning-900 dark:text-warning-100">
                            {expenseDistribution.wantPercentage}%
                        </p>
                        <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
                            ${expenseDistribution.want.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Luxury</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {expenseDistribution.luxuryPercentage}%
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            ${expenseDistribution.luxury.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/transactions'}>
                        View All
                    </Button>
                </div>
                {recentTransactions.length === 0 ? (
                    <p className="text-center text-[var(--color-text-tertiary)] py-8">
                        No transactions yet. Add your first transaction to get started!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 bg-[var(--color-bg-tertiary)] rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">
                                        {transaction.category}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <p
                                    className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                                        }`}
                                >
                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Transaction Modal */}
            <Modal
                isOpen={showAddTransaction}
                onClose={() => setShowAddTransaction(false)}
                title={`Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
            >
                <TransactionForm
                    type={transactionType}
                    onSuccess={() => setShowAddTransaction(false)}
                />
            </Modal>
        </div>
    );
};

export default Dashboard;
