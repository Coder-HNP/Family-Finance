import React from 'react';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    icon: Icon,
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
};

export default Input;
