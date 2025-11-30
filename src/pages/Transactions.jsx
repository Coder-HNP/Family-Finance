import React, { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useTransactions } from '../hooks/useTransactions';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TransactionForm from '../components/transactions/TransactionForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useExport } from '../hooks/useExport';
import { formatDate } from '../utils/dateHelpers';

const Transactions = () => {
    const { transactions, loading } = useFinance();
    const { deleteTransaction } = useTransactions();
    const { exportTransactionsXLSX, exportTransactionsCSV } = useExport();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filter, setFilter] = useState('all'); // all, income, expense

    const filteredTransactions = useMemo(() => {
        if (filter === 'all') return transactions;
        return transactions.filter(t => t.type === filter);
    }, [transactions, filter]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    const handleExport = (format) => {
        if (format === 'xlsx') {
            exportTransactionsXLSX(transactions, `transactions-${Date.now()}`);
        } else {
            exportTransactionsCSV(transactions, `transactions-${Date.now()}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className="content-container pb-20 lg:pb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        Transactions
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Manage all your income and expenses
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')}>
                        <Download className="w-4 h-4" />
                        XLSX
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                        <Download className="w-4 h-4" />
                        CSV
                    </Button>
                    <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <Button
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All
                </Button>
                <Button
                    variant={filter === 'income' ? 'success' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('income')}
                >
                    Income
                </Button>
                <Button
                    variant={filter === 'expense' ? 'danger' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('expense')}
                >
                    Expenses
                </Button>
            </div>

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-[var(--color-text-tertiary)] mb-4">
                        No transactions found. Add your first transaction to get started!
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                        Add Transaction
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span
                                        className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-danger'
                                            }`}
                                    >
                                        {transaction.type}
                                    </span>
                                    {transaction.expenseType && (
                                        <span className="badge badge-primary">{transaction.expenseType}</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                                    {transaction.category}
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {formatDate(transaction.date)} • {transaction.notes || 'No notes'}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p
                                    className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                                        }`}
                                >
                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingTransaction(transaction)}
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 text-primary-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-danger-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Transaction"
            >
                <TransactionForm onSuccess={() => setShowAddModal(false)} />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                title="Edit Transaction"
            >
                <TransactionForm
                    transaction={editingTransaction}
                    onSuccess={() => setEditingTransaction(null)}
                />
            </Modal>
        </div>
    );
};

export default Transactions;
