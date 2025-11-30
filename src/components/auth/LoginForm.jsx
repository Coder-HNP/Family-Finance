import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { Mail, Lock, Chrome } from 'lucide-react';

const LoginForm = ({ onSwitchToSignup, onSwitchToForgot }) => {
    const { login, loginWithGoogle } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (!result.success) {
            setErrors({ general: result.error });
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const result = await loginWithGoogle();
        setLoading(false);

        if (!result.success) {
            setErrors({ general: result.error });
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    icon={Mail}
                    error={errors.email}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    icon={Lock}
                    error={errors.password}
                    required
                />

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onSwitchToForgot}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Forgot password?
                    </button>
                </div>

                {errors.general && (
                    <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                        <p className="text-sm text-danger-600 dark:text-danger-400">{errors.general}</p>
                    </div>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-border)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loading}
                icon={Chrome}
            >
                Google
            </Button>

            <p className="text-center text-sm text-[var(--color-text-secondary)]">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Sign up
                </button>
            </p>
        </div>
    );
};

export default LoginForm;
