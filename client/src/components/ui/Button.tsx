import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: ButtonProps) {
    const baseStyles = 'px-5 py-3 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97]';

    const variants = {
        primary: 'text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
        secondary: 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 focus:ring-slate-400 border border-slate-200/60 dark:border-slate-700/40',
        danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-400 border border-red-200/60 dark:border-red-800/40',
    };

    const primaryStyle = variant === 'primary' ? {
        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
    } : {};

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={primaryStyle}
        >
            {children}
        </button>
    );
}
