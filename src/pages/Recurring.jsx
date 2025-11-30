import React from 'react';
import { Repeat, Plus } from 'lucide-react';
import Button from '../components/common/Button';

const Recurring = () => {
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
                <Button variant="primary" icon={Plus}>
                    Add Recurring Payment
                </Button>
            </div>

            <div className="card p-12 text-center">
                <Repeat className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                <h3 className="text-xl font-semibold mb-2">Recurring Payments Coming Soon</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Track subscriptions, bills, and other recurring payments automatically.
                </p>
                <Button variant="primary" icon={Plus}>
                    Add Your First Recurring Payment
                </Button>
            </div>
        </div>
    );
};

export default Recurring;
