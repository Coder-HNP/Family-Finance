import React from 'react';
import { Bell, Plus } from 'lucide-react';
import Button from '../components/common/Button';

const Reminders = () => {
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
                <Button variant="primary" icon={Plus}>
                    Add Reminder
                </Button>
            </div>

            <div className="card p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                <h3 className="text-xl font-semibold mb-2">Bill Reminders Coming Soon</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Set up reminders for upcoming bills and never miss a payment.
                </p>
                <Button variant="primary" icon={Plus}>
                    Create Your First Reminder
                </Button>
            </div>
        </div>
    );
};

export default Reminders;
