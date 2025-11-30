import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useBudget } from '../hooks/useBudget';
import { useToast } from '../contexts/ToastContext';
import { Plus, Edit2, Trash2, AlertCircle, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import { calculateCategoryBreakdown, getCurrentMonthTransactions } from '../utils/calculations';

const BudgetForm = ({ budget, onSuccess, onCancel }) => {
    const { createBudget, updateBudget } = useBudget();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: budget?.category || '',
        limit: budget?.limit || '',
        month: budget?.month || new Date().toISOString().slice(0, 7),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = budget
            ? await updateBudget(budget.id, formData)
            : await createBudget(formData);

        setLoading(false);

        if (result.success) {
            success(budget ? 'Budget updated successfully' : 'Budget created successfully');
            onSuccess();
        } else {
            error(result.error || 'Failed to save budget');
        }
    };

    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={allCategories.map(cat => ({ value: cat, label: cat }))}
                required
            />
            <Input
                label="Budget Limit ($)"
                type="number"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) })}
                placeholder="500"
                required
                min="0"
                step="0.01"
            />
            <Input
                label="Month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
                </Button>
            </div>
        </form>
    );
};

const BudgetCard = ({ budget, spent, onEdit, onDelete }) => {
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const isOverBudget = percentage > 100;
    const isNearLimit = percentage > 80 && percentage <= 100;

    return (
        <div className={`card p-6 border-l-4 ${isOverBudget ? 'border-danger-500' : isNearLimit ? 'border-warning-500' : 'border-success-500'
            }`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {budget.category}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        {budget.month}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(budget)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <Edit2 className="w-4 h-4 text-primary-600" />
                    </button>
                    <button
                        onClick={() => onDelete(budget.id)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-danger-600" />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Spent</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-danger-600' : 'text-[var(--color-text-primary)]'
                        }`}>
                        ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                    </span>
                </div>

                <div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-danger-500' : isNearLimit ? 'bg-warning-500' : 'bg-success-500'
                            }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${isOverBudget ? 'text-danger-600' : isNearLimit ? 'text-warning-600' : 'text-success-600'
                        }`}>
                        {percentage.toFixed(1)}% used
                    </span>
                    {isOverBudget && (
                        <span className="flex items-center gap-1 text-xs text-danger-600">
                            <AlertCircle className="w-3 h-3" />
                            Over budget!
                        </span>
                    )}
                    {isNearLimit && !isOverBudget && (
                        <span className="flex items-center gap-1 text-xs text-warning-600">
                            <AlertCircle className="w-3 h-3" />
                            Near limit
                        </span>
                    )}
                    {!isOverBudget && !isNearLimit && (
                        <span className="flex items-center gap-1 text-xs text-success-600">
                            <TrendingUp className="w-3 h-3" />
                            On track
                        </span>
                    )}
                </div>

                <div className="text-xs text-[var(--color-text-tertiary)]">
                    Remaining: ${Math.max(0, budget.limit - spent).toFixed(2)}
                </div>
            </div>
        </div>
    );
};

const Budget = () => {
    const { budgets, transactions, loading } = useFinance();
    const { deleteBudget, initializeDefaultBudget } = useBudget();
    const { success, error } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);

    // Calculate spending per category
    const categorySpending = calculateCategoryBreakdown(
        currentMonthTransactions.filter(t => t.type === 'expense')
    );

    const getSpentAmount = (category) => {
        const categoryData = categorySpending.find(c => c.category === category);
        return categoryData ? categoryData.amount : 0;
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            const result = await deleteBudget(id);
            if (result.success) {
                success('Budget deleted successfully');
            } else {
                error(result.error || 'Failed to delete budget');
            }
        }
    };

    const handleInitializeDefaults = async () => {
        const result = await initializeDefaultBudget();
        if (result.success) {
            success('Default budgets created successfully');
        } else {
            error(result.error || 'Failed to create default budgets');
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
                        Budget Planner
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Set and track your monthly budget goals
                    </p>
                </div>
                <div className="flex gap-2">
                    {currentMonthBudgets.length === 0 && (
                        <Button variant="outline" onClick={handleInitializeDefaults}>
                            Initialize Defaults
                        </Button>
                    )}
                    <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                        Add Budget
                    </Button>
                </div>
            </div>

            {currentMonthBudgets.length === 0 ? (
                <div className="card p-12 text-center">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                    <h3 className="text-xl font-semibold mb-2">No Budgets Set</h3>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        Create budgets to track your spending and stay on top of your finances.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={handleInitializeDefaults}>
                            Initialize Default Budgets
                        </Button>
                        <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
                            Create Custom Budget
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMonthBudgets.map((budget) => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            spent={getSpentAmount(budget.category)}
                            onEdit={setEditingBudget}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Add Budget Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Budget"
            >
                <BudgetForm
                    onSuccess={() => setShowAddModal(false)}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            {/* Edit Budget Modal */}
            <Modal
                isOpen={!!editingBudget}
                onClose={() => setEditingBudget(null)}
                title="Edit Budget"
            >
                <BudgetForm
                    budget={editingBudget}
                    onSuccess={() => setEditingBudget(null)}
                    onCancel={() => setEditingBudget(null)}
                />
            </Modal>
        </div>
    );
};

export default Budget;
