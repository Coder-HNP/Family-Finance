import React, { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useInsights } from '../hooks/useInsights';
import {
    calculateIncomeExpense,
    calculateCategoryBreakdown,
    calculateExpenseTypeDistribution,
    calculateMonthlyTrends,
    getCurrentMonthTransactions,
} from '../utils/calculations';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS, CATEGORY_COLORS } from '../utils/constants';
import { AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Analytics = () => {
    const { transactions, loading } = useFinance();
    const { insights, highPriorityInsights, positiveInsights } = useInsights();

    const monthlyTrends = useMemo(() => calculateMonthlyTrends(transactions), [transactions]);

    const categoryData = useMemo(() => {
        const currentMonth = getCurrentMonthTransactions(transactions);
        const expenses = currentMonth.filter(t => t.type === 'expense');
        return calculateCategoryBreakdown(expenses);
    }, [transactions]);

    const expenseTypeData = useMemo(() => {
        const currentMonth = getCurrentMonthTransactions(transactions);
        const distribution = calculateExpenseTypeDistribution(currentMonth);
        return [
            { name: 'Needs', value: distribution.need, percentage: distribution.needPercentage },
            { name: 'Wants', value: distribution.want, percentage: distribution.wantPercentage },
            { name: 'Luxury', value: distribution.luxury, percentage: distribution.luxuryPercentage },
        ];
    }, [transactions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className="content-container pb-20 lg:pb-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    Analytics & Insights
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Visualize your financial data and get smart insights
                </p>
            </div>

            {/* Smart Insights */}
            {insights.length > 0 && (
                <div className="mb-8 space-y-3">
                    <h2 className="text-xl font-semibold mb-4">Smart Insights</h2>

                    {highPriorityInsights.map((insight, index) => (
                        <div key={index} className="card p-4 flex items-start gap-3 border-l-4 border-danger-500">
                            <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-[var(--color-text-primary)]">{insight.message}</p>
                                {insight.category && (
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                        Category: {insight.category}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {positiveInsights.map((insight, index) => (
                        <div key={index} className="card p-4 flex items-start gap-3 border-l-4 border-success-500">
                            <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                            <p className="font-medium text-[var(--color-text-primary)]">{insight.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Monthly Income vs Expense */}
            <div className="card p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Income vs Expenses</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
                        <YAxis stroke="var(--color-text-secondary)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="income" fill={CHART_COLORS.income} name="Income" />
                        <Bar dataKey="expense" fill={CHART_COLORS.expense} name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Category-wise Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="amount"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.category}: $${entry.amount.toFixed(0)}`}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Need/Want/Luxury Distribution */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Need / Want / Luxury</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={expenseTypeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                label={(entry) => `${entry.name}: ${entry.percentage}%`}
                            >
                                <Cell fill={CHART_COLORS.need} />
                                <Cell fill={CHART_COLORS.want} />
                                <Cell fill={CHART_COLORS.luxury} />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Savings Trend */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Savings Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
                        <YAxis stroke="var(--color-text-secondary)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px'
                            }}
                        />
                        <Area type="monotone" dataKey="savings" stroke={CHART_COLORS.savings} fill={CHART_COLORS.savings} fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
