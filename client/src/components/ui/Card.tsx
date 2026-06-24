import React from 'react'

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-100/80 dark:border-slate-800/50 p-5 transition-all duration-300 hover:shadow-lg dark:hover:shadow-slate-900/40 ${className}`}
          style={{ boxShadow: 'var(--shadow-card)' }}>
            {children}
        </div>
    );
}

export default Card