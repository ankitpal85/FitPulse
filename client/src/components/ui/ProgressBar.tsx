export default function ProgressBar({ value, max = 100, className = '' }: { value: number; max?: number; className?: string; }) {

    const percentage = Math.min(Math.round((value / (max || 1)) * 100), 100);
    const isOverLimit = value > max;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="w-full bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden h-3">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                    style={{
                        width: `${percentage}%`,
                        background: isOverLimit
                            ? 'linear-gradient(90deg, #ef4444, #f97316)'
                            : 'linear-gradient(90deg, #10b981, #06b6d4)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
