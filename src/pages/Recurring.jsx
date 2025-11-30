import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useRecurring } from '../hooks/useRecurring';
import { useToast } from '../contexts/ToastContext';
import { Plus, Edit2, Trash2, Play, Pause } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { EXPENSE_CATEGORIES, RECURRING_FREQUENCIES } from '../utils/constants';

const RecurringForm = ({ payment, onSuccess, onCancel }) => {
    const { addRecurringPayment, updateRecurringPayment } = useRecurring();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: payment?.name || '',
        amount: payment?.amount || '',
        frequency: payment?.frequency || 'monthly',
        category: payment?.category || '',
        nextDate: payment?.nextDate || new Date().toISOString().slice(0, 10),
        type: payment?.type || 'expense',
        expenseType: payment?.expenseType || 'need',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = payment
            ? await updateRecurringPayment(payment.id, formData)
            : await addRecurringPayment(formData);

        setLoading(false);

        if (result.success) {
            success(payment ? 'Recurring payment updated' : 'Recurring payment added');
            onSuccess();
        } else {
            error(result.error || 'Failed to save recurring payment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Netflix Subscription"
                required
            />
            <Input
                label="Amount ($)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="15.99"
                required
                min="0"
                step="0.01"
            />
            <Select
                label="Frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                options={RECURRING_FREQUENCIES.map(freq => ({ value: freq.toLowerCase(), label: freq }))}
                required
            />
            <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                required
            />
            <Input
                label="Next Payment Date"
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                required
            />
            <Select
                label="Expense Type"
                value={formData.expenseType}
                onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                options={[
                    { value: 'need', label: 'Need' },
                    { value: 'want', label: 'Want' },
                    { value: 'luxury', label: 'Luxury' },
                ]}
                required
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : payment ? 'Update' : 'Add'}
                </Button>
            </div>
        </form>
    );
};

const Recurring = () => {
    const { recurringPayments, loading } = useFinance();
    const { deleteRecurringPayment, toggleRecurringPayment } = useRecurring();
    const { success, error } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recurring payment?')) {
            const result = await deleteRecurringPayment(id);
            if (result.success) {
                success('Recurring payment deleted');
            } else {
                error(result.error || 'Failed to delete');
            }
        }
    };

    const handleToggle = async (id, isActive) => {
        const result = await toggleRecurringPayment(id, !isActive);
        if (result.success) {
            success(isActive ? 'Payment paused' : 'Payment activated');
        } else {
            error(result.error || 'Failed to toggle');
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
                        Recurring Payments
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Manage your subscriptions and recurring expenses
                    </p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                    Add Recurring Payment
                </Button>
            </div>

            {recurringPayments.length === 0 ? (
                <div className="card p-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">No Recurring Payments</h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        Add recurring payments to track subscriptions and regular expenses.
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                        Add Your First Recurring Payment
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {recurringPayments.map((payment) => (
                        <div key={payment.id} className="card p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                                        {payment.name}
                                    </h3>
                                    <span className="badge badge-primary">{payment.frequency}</span>
                                    {payment.isActive === false && (
                                        <span className="badge badge-secondary">Paused</span>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {payment.category} • Next: {payment.nextDate}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-2xl font-bold text-danger-600">
                                    ${payment.amount}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggle(payment.id, payment.isActive !== false)}
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                        title={payment.isActive === false ? 'Activate' : 'Pause'}
                                    >
                                        {payment.isActive === false ? (
                                            <Play className="w-4 h-4 text-success-600" />
                                        ) : (
                                            <Pause className="w-4 h-4 text-warning-600" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setEditingPayment(payment)}
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 text-primary-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(payment.id)}
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

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Recurring Payment">
                <RecurringForm onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
            </Modal>

            <Modal isOpen={!!editingPayment} onClose={() => setEditingPayment(null)} title="Edit Recurring Payment">
                <RecurringForm payment={editingPayment} onSuccess={() => setEditingPayment(null)} onCancel={() => setEditingPayment(null)} />
            </Modal>
        </div>
    );
};

export default Recurring;
