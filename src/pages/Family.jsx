import React from 'react';
import { Users, Plus } from 'lucide-react';
import Button from '../components/common/Button';

const Family = () => {
    return (
        <div className="content-container pb-20 lg:pb-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        Family Accounts
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Share and collaborate on family finances
                    </p>
                </div>
                <Button variant="primary" icon={Plus}>
                    Invite Member
                </Button>
            </div>

            <div className="card p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                <h3 className="text-xl font-semibold mb-2">Family Sharing Coming Soon</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Invite family members to collaborate on shared finances and budgets.
                </p>
                <Button variant="primary" icon={Plus}>
                    Create Family Account
                </Button>
            </div>
        </div>
    );
};

export default Family;
