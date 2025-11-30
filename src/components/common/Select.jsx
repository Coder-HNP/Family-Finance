import React from 'react';

const Select = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    error,
    required = false,
    disabled = false,
    className = '',
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
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`input-field ${error ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
};

export default Select;
