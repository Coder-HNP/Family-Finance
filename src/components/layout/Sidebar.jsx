import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    BarChart3,
    Wallet,
    Users,
    Repeat,
    PiggyBank,
    Bell,
    Settings,
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/transactions', icon: Receipt, label: 'Transactions' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/budget', icon: Wallet, label: 'Budget' },
        { to: '/family', icon: Users, label: 'Family' },
        { to: '/recurring', icon: Repeat, label: 'Recurring' },
        { to: '/savings', icon: PiggyBank, label: 'Savings' },
        { to: '/reminders', icon: Bell, label: 'Reminders' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:pt-16 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]">
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] shadow-lg">
                <nav className="flex justify-around items-center h-16 px-2">
                    {navItems.slice(0, 5).map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? 'text-primary-500'
                                    : 'text-[var(--color-text-tertiary)]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
