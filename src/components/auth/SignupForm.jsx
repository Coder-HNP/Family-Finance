import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { Mail, Lock, User } from 'lucide-react';

const SignupForm = ({ onSwitchToLogin }) => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        const result = await signup(formData.email, formData.password, formData.displayName);
        setLoading(false);

        if (!result.success) {
            setErrors({ general: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Full Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter your name"
                icon={User}
                error={errors.displayName}
                required
            />

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
                placeholder="Create a password"
                icon={Lock}
                error={errors.password}
                required
            />

            <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={Lock}
                error={errors.confirmPassword}
                required
            />

            {errors.general && (
                <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                    <p className="text-sm text-danger-600 dark:text-danger-400">{errors.general}</p>
                </div>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-[var(--color-text-secondary)]">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Login
                </button>
            </p>
        </form>
    );
};

export default SignupForm;
