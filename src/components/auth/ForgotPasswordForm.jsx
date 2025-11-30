import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordForm = ({ onBack }) => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        const result = await resetPassword(email);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setError('');
        } else {
            setError(result.error);
        }
    };

    if (success) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                    <p className="text-sm text-success-600 dark:text-success-400">
                        Password reset email sent! Check your inbox for instructions.
                    </p>
                </div>
                <Button variant="outline" className="w-full" onClick={onBack} icon={ArrowLeft}>
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={Mail}
                error={error}
                required
            />

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Button type="button" variant="outline" className="w-full" onClick={onBack} icon={ArrowLeft}>
                Back to Login
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
