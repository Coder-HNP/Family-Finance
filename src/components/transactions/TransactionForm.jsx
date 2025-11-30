import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { TRANSACTION_TYPES, EXPENSE_TYPES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { getTodayString } from '../../utils/dateHelpers';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Toast from '../common/Toast';

const TransactionForm = ({ type = 'expense', transaction = null, onSuccess }) => {
    const { addTransaction, updateTransaction } = useTransactions();
    const [formData, setFormData] = useState({
        type: transaction?.type || type,
        amount: transaction?.amount || '',
        category: transaction?.category || '',
        date: transaction?.date || getTodayString(),
        notes: transaction?.notes || '',
        expenseType: transaction?.expenseType || EXPENSE_TYPES.NEED,
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            ...formData,
            amount: parseFloat(formData.amount),
        };

        // Remove expenseType if it's income
        if (data.type === TRANSACTION_TYPES.INCOME) {
            delete data.expenseType;
        }

        let result;
        if (transaction) {
            result = await updateTransaction(transaction.id, data);
        } else {
            result = await addTransaction(data);
        }

        setLoading(false);

        if (result.success) {
            setToast({
                show: true,
                message: transaction ? 'Transaction updated successfully!' : 'Transaction added successfully!',
                type: 'success',
            });

            // Reset form if adding new
            if (!transaction) {
                setFormData({
                    type,
                    amount: '',
                    category: '',
                    date: getTodayString(),
                    notes: '',
                    expenseType: EXPENSE_TYPES.NEED,
                });
            }

            // Call onSuccess callback
            if (onSuccess) {
                setTimeout(() => onSuccess(), 1000);
            }
        } else {
            setToast({
                show: true,
                message: result.error || 'Failed to save transaction',
                type: 'error',
            });
        }
    };

    const categories = formData.type === TRANSACTION_TYPES.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={[
                        { value: TRANSACTION_TYPES.INCOME, label: 'Income' },
                        { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
                    ]}
                    required
                />

                <Input
                    label="Amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                />

                <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories}
                    placeholder="Select category"
                    required
                />

                {formData.type === TRANSACTION_TYPES.EXPENSE && (
                    <Select
                        label="Expense Type"
                        name="expenseType"
                        value={formData.expenseType}
                        onChange={handleChange}
                        options={[
                            { value: EXPENSE_TYPES.NEED, label: 'Need' },
                            { value: EXPENSE_TYPES.WANT, label: 'Want' },
                            { value: EXPENSE_TYPES.LUXURY, label: 'Luxury' },
                        ]}
                        required
                    />
                )}

                <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any notes..."
                        rows="3"
                        className="input-field resize-none"
                    />
                </div>

                <div className="flex gap-3">
                    <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                        {loading ? 'Saving...' : transaction ? 'Update' : 'Add Transaction'}
                    </Button>
                    {onSuccess && (
                        <Button type="button" variant="secondary" onClick={onSuccess}>
                            Cancel
                        </Button>
                    )}
                </div>
            </form>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </>
    );
};

export default TransactionForm;
