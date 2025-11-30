import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useReminders } from '../hooks/useReminders';
import { useToast } from '../contexts/ToastContext';
import { Plus, Edit2, Trash2, Check, X, Bell, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { EXPENSE_CATEGORIES } from '../utils/constants';

const ReminderForm = ({ reminder, onSuccess, onCancel }) => {
    const { addReminder, updateReminder } = useReminders();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: reminder?.name || '',
        amount: reminder?.amount || '',
        dueDate: reminder?.dueDate || '',
        category: reminder?.category || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = reminder
            ? await updateReminder(reminder.id, formData)
            : await addReminder(formData);

        setLoading(false);

        if (result.success) {
            success(reminder ? 'Reminder updated' : 'Reminder created');
            onSuccess();
        } else {
            error(result.error || 'Failed to save reminder');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Bill Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Credit Card Payment"
                required
            />
            <Input
                label="Amount ($)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                placeholder="500"
                required
                min="0"
                step="0.01"
            />
            <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
            />
            <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                required
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : reminder ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
};

const Reminders = () => {
    const { billReminders, loading } = useFinance();
    const { deleteReminder, markAsPaid, markAsUnpaid } = useReminders();
    const { success, error } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this reminder?')) {
            const result = await deleteReminder(id);
            if (result.success) {
                success('Reminder deleted');
            } else {
                error(result.error || 'Failed to delete');
            }
        }
    };

    const handleTogglePaid = async (id, isPaid) => {
        const result = isPaid ? await markAsUnpaid(id) : await markAsPaid(id);
        if (result.success) {
            success(isPaid ? 'Marked as unpaid' : 'Marked as paid');
        } else {
            error(result.error || 'Failed to update');
        }
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    const isDueSoon = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const upcomingReminders = billReminders.filter(r => !r.isPaid && !isOverdue(r.dueDate));
    const overdueReminders = billReminders.filter(r => !r.isPaid && isOverdue(r.dueDate));
    const paidReminders = billReminders.filter(r => r.isPaid);

    return (
        <div className="content-container pb-20 lg:pb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        Bill Reminders
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Never miss a bill payment again
                    </p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                    Add Reminder
                </Button>
            </div>

            {billReminders.length === 0 ? (
                <div className="card p-12 text-center">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                    <h3 className="text-xl font-semibold mb-2">No Bill Reminders</h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        Set up reminders for upcoming bills and never miss a payment.
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                        Create Your First Reminder
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Overdue Reminders */}
                    {overdueReminders.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-danger-600 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Overdue ({overdueReminders.length})
                            </h2>
                            <div className="space-y-3">
                                {overdueReminders.map((reminder) => (
                                    <div key={reminder.id} className="card p-4 border-l-4 border-danger-500 flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[var(--color-text-primary)]">
                                                {reminder.name}
                                            </h3>
                                            <p className="text-sm text-danger-600">
                                                Overdue: {reminder.dueDate} • {reminder.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-bold text-danger-600">
                                                ${reminder.amount}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleTogglePaid(reminder.id, false)}
                                                    className="p-2 rounded-lg bg-success-100 hover:bg-success-200 transition-colors"
                                                    title="Mark as paid"
                                                >
                                                    <Check className="w-4 h-4 text-success-600" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingReminder(reminder)}
                                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4 text-primary-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reminder.id)}
                                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-danger-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Reminders */}
                    {upcomingReminders.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Upcoming ({upcomingReminders.length})
                            </h2>
                            <div className="space-y-3">
                                {upcomingReminders.map((reminder) => {
                                    const dueSoon = isDueSoon(reminder.dueDate);
                                    return (
                                        <div key={reminder.id} className={`card p-4 border-l-4 ${dueSoon ? 'border-warning-500' : 'border-primary-500'} flex items-center justify-between`}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                                                        {reminder.name}
                                                    </h3>
                                                    {dueSoon && (
                                                        <span className="badge badge-warning text-xs">Due Soon</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">
                                                    Due: {reminder.dueDate} • {reminder.category}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                                    ${reminder.amount}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleTogglePaid(reminder.id, false)}
                                                        className="p-2 rounded-lg bg-success-100 hover:bg-success-200 transition-colors"
                                                        title="Mark as paid"
                                                    >
                                                        <Check className="w-4 h-4 text-success-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingReminder(reminder)}
                                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-primary-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(reminder.id)}
                                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-danger-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Paid Reminders */}
                    {paidReminders.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-success-600 mb-3 flex items-center gap-2">
                                <Check className="w-5 h-5" />
                                Paid ({paidReminders.length})
                            </h2>
                            <div className="space-y-3">
                                {paidReminders.map((reminder) => (
                                    <div key={reminder.id} className="card p-4 border-l-4 border-success-500 flex items-center justify-between opacity-75">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[var(--color-text-primary)] line-through">
                                                {reminder.name}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-secondary)]">
                                                Paid on: {reminder.paidAt?.slice(0, 10) || reminder.dueDate} • {reminder.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-bold text-success-600">
                                                ${reminder.amount}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleTogglePaid(reminder.id, true)}
                                                    className="p-2 rounded-lg bg-warning-100 hover:bg-warning-200 transition-colors"
                                                    title="Mark as unpaid"
                                                >
                                                    <X className="w-4 h-4 text-warning-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reminder.id)}
                                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-danger-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Bill Reminder">
                <ReminderForm onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
            </Modal>

            <Modal isOpen={!!editingReminder} onClose={() => setEditingReminder(null)} title="Edit Bill Reminder">
                <ReminderForm reminder={editingReminder} onSuccess={() => setEditingReminder(null)} onCancel={() => setEditingReminder(null)} />
            </Modal>
        </div>
    );
};

export default Reminders;
