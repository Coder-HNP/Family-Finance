import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-sm text-[var(--color-text-tertiary)]">
                    <p>&copy; {new Date().getFullYear()} Family Finance Tracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
