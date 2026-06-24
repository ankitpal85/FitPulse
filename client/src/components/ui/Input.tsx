import React from 'react';

interface InputProps {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
}

export default function Input({ label, type = 'text', value, onChange, placeholder = '', className = '', required = false, min, max }: InputProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                    {required && <span className='text-rose-500 ml-1'>*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className='w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all duration-300'
            />
        </div>
    );
}
