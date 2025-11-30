import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const Auth = () => {
    const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-lg">
                        <span className="text-white font-bold text-3xl">F</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">
                        Family Finance Tracker
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        {mode === 'login' && 'Welcome back! Please login to your account.'}
                        {mode === 'signup' && 'Create your account to get started.'}
                        {mode === 'forgot' && 'Reset your password'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="card p-8 shadow-xl">
                    {mode === 'login' && (
                        <LoginForm
                            onSwitchToSignup={() => setMode('signup')}
                            onSwitchToForgot={() => setMode('forgot')}
                        />
                    )}
                    {mode === 'signup' && (
                        <SignupForm onSwitchToLogin={() => setMode('login')} />
                    )}
                    {mode === 'forgot' && (
                        <ForgotPasswordForm onBack={() => setMode('login')} />
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-[var(--color-text-tertiary)] mt-8">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Auth;
