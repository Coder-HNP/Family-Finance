import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import Button from '../components/common/Button';

const Budget = () => {
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
                <Button variant="primary" icon={Plus}>
                    Set Budget
                </Button>
            </div>

            <div className="card p-12 text-center">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                <h3 className="text-xl font-semibold mb-2">Budget Feature Coming Soon</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Set category-wise budgets and track your spending against limits.
                </p>
                <Button variant="primary" icon={Plus}>
                    Create Your First Budget
                </Button>
            </div>
        </div>
    );
};

export default Budget;
