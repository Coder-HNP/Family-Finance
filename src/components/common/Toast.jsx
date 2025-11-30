import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const colors = {
        success: 'bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800',
        error: 'bg-danger-50 dark:bg-danger-900/20 text-danger-800 dark:text-danger-300 border-danger-200 dark:border-danger-800',
        warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800',
        info: 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 border-primary-200 dark:border-primary-800',
    };

    const Icon = icons[type];

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[type]} min-w-[300px] max-w-md`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
