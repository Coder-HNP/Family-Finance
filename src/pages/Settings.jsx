import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, User, Moon, Sun } from 'lucide-react';
import Button from '../components/common/Button';

const Settings = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await logout();
        }
    };

    return (
        <div className="content-container pb-20 lg:pb-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    Settings
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Manage your account and preferences
                </p>
            </div>

            {/* Profile Section */}
            <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                            Name
                        </label>
                        <p className="text-[var(--color-text-primary)]">{user?.displayName || 'Not set'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                            Email
                        </label>
                        <p className="text-[var(--color-text-primary)]">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    Appearance
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-[var(--color-text-primary)]">Dark Mode</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            Toggle between light and dark theme
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isDark ? 'bg-primary-600' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Account Actions */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Account
                </h2>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Settings;
