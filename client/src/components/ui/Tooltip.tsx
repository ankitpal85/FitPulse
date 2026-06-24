import { type ReactNode } from "react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className="relative group flex items-center">
            {children}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2.5 bg-white/90 dark:bg-white/10 backdrop-blur-xl text-slate-700 dark:text-white text-xs rounded-xl shadow-lg border border-slate-200/50 dark:border-white/[0.08] z-50 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                {content}
            </div>
        </div>
    );
}
