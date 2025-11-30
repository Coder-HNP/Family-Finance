import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Menu,
    X,
    Sun,
    Moon,
    User,
    LogOut,
    Settings
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="sticky top-0 z-40 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                        >
                            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <span className="text-xl font-bold text-gradient hidden sm:block">
                                Family Finance
                            </span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                            >
                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <span className="hidden sm:block text-sm font-medium">
                                    {user?.displayName || 'User'}
                                </span>
                            </button>

                            {/* Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg py-2 animate-scale-in">
                                    <Link
                                        to="/settings"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="text-sm">Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--color-bg-tertiary)] transition-colors text-danger-500"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
