import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useGoals } from '../hooks/useGoals';
import { useToast } from '../contexts/ToastContext';
import { Plus, Edit2, Trash2, TrendingUp, Target } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GoalForm = ({ goal, onSuccess, onCancel }) => {
    const { addGoal, updateGoal } = useGoals();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: goal?.name || '',
        targetAmount: goal?.targetAmount || '',
        currentAmount: goal?.currentAmount || 0,
        deadline: goal?.deadline || '',
        category: goal?.category || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = goal
            ? await updateGoal(goal.id, formData)
            : await addGoal(formData);

        setLoading(false);

        if (result.success) {
            success(goal ? 'Goal updated' : 'Goal created');
            onSuccess();
        } else {
            error(result.error || 'Failed to save goal');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Goal Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Emergency Fund"
                required
            />
            <Input
                label="Target Amount ($)"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                placeholder="10000"
                required
                min="0"
                step="0.01"
            />
            <Input
                label="Current Amount ($)"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) })}
                placeholder="0"
                min="0"
                step="0.01"
            />
            <Input
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
            />
            <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Emergency, Travel, Electronics, etc."
                required
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : goal ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
};

const Savings = () => {
    const { savingsGoals, loading } = useFinance();
    const { deleteGoal, updateGoal, completeGoal } = useGoals();
    const { success, error } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [addingToGoal, setAddingToGoal] = useState(null);
    const [addAmount, setAddAmount] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            const result = await deleteGoal(id);
            if (result.success) {
                success('Goal deleted');
            } else {
                error(result.error || 'Failed to delete');
            }
        }
    };

    const handleAddToGoal = async () => {
        if (!addingToGoal || !addAmount) return;

        const newAmount = addingToGoal.currentAmount + parseFloat(addAmount);
        const result = await updateGoal(addingToGoal.id, { currentAmount: newAmount });

        if (result.success) {
            success(`Added $${addAmount} to ${addingToGoal.name}`);
            setAddingToGoal(null);
            setAddAmount('');

            // Check if goal is completed
            if (newAmount >= addingToGoal.targetAmount) {
                await completeGoal(addingToGoal.id);
                success('🎉 Goal completed!');
            }
        } else {
            error(result.error || 'Failed to add amount');
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
                        Savings Goals
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Set and track your savings targets
                    </p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                    Create Goal
                </Button>
            </div>

            {savingsGoals.length === 0 ? (
                <div className="card p-12 text-center">
                    <Target className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                    <h3 className="text-xl font-semibold mb-2">No Savings Goals</h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        Create savings goals and track your progress towards achieving them.
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                        Create Your First Goal
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savingsGoals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const isCompleted = goal.isCompleted || progress >= 100;

                        return (
                            <div key={goal.id} className={`card p-6 ${isCompleted ? 'border-2 border-success-500' : ''}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                            {goal.name}
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            {goal.category}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingGoal(goal)}
                                            className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 text-primary-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-danger-600" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-secondary)]">Progress</span>
                                        <span className="font-semibold text-[var(--color-text-primary)]">
                                            ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${isCompleted ? 'bg-success-500' : 'bg-primary-500'
                                                }`}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-medium ${isCompleted ? 'text-success-600' : 'text-primary-600'
                                            }`}>
                                            {progress.toFixed(1)}% complete
                                        </span>
                                        {isCompleted && (
                                            <span className="text-xs text-success-600 font-semibold">
                                                ✓ Completed!
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs text-[var(--color-text-tertiary)]">
                                        Deadline: {goal.deadline}
                                    </div>

                                    {!isCompleted && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            icon={TrendingUp}
                                            onClick={() => setAddingToGoal(goal)}
                                            className="w-full"
                                        >
                                            Add Money
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Savings Goal">
                <GoalForm onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
            </Modal>

            <Modal isOpen={!!editingGoal} onClose={() => setEditingGoal(null)} title="Edit Savings Goal">
                <GoalForm goal={editingGoal} onSuccess={() => setEditingGoal(null)} onCancel={() => setEditingGoal(null)} />
            </Modal>

            <Modal isOpen={!!addingToGoal} onClose={() => { setAddingToGoal(null); setAddAmount(''); }} title={`Add to ${addingToGoal?.name}`}>
                <div className="space-y-4">
                    <Input
                        label="Amount to Add ($)"
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="100"
                        min="0"
                        step="0.01"
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                        <Button variant="secondary" onClick={() => { setAddingToGoal(null); setAddAmount(''); }}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddToGoal} disabled={!addAmount}>
                            Add ${addAmount || '0'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Savings;
