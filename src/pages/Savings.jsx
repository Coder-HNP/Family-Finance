import React from 'react';
import { PiggyBank, Plus } from 'lucide-react';
import Button from '../components/common/Button';

const Savings = () => {
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
                <Button variant="primary" icon={Plus}>
                    Create Goal
                </Button>
            </div>

            <div className="card p-12 text-center">
                <PiggyBank className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                <h3 className="text-xl font-semibold mb-2">Savings Goals Coming Soon</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Create savings goals and track your progress towards achieving them.
                </p>
                <Button variant="primary" icon={Plus}>
                    Create Your First Goal
                </Button>
            </div>
        </div>
    );
};

export default Savings;
