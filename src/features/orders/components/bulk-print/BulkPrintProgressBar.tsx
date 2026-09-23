import { cn } from '@/lib/utils';

interface BulkPrintProgressBarProps {
    /** Null renders an indeterminate bar — the API gave no usable total to measure against. */
    percent: number | null;
    label: string;
    /** Describes what the bar is measuring for screen readers. */
    ariaLabel: string;
    className?: string;
    barClassName?: string;
}

/**
 * Progress for one batch. Values come straight from the API's processed/total counts;
 * when they are unusable the bar goes indeterminate rather than showing an invented
 * percentage.
 */
export const BulkPrintProgressBar = ({
    percent,
    label,
    ariaLabel,
    className,
    barClassName,
}: BulkPrintProgressBarProps) => {
    const isIndeterminate = percent === null;

    return (
        <div className={cn('space-y-1.5', className)}>
            <div
                role="progressbar"
                aria-label={ariaLabel}
                aria-valuetext={label}
                {...(isIndeterminate ? {} : { 'aria-valuenow': percent, 'aria-valuemin': 0, 'aria-valuemax': 100 })}
                className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800"
            >
                <div
                    className={cn(
                        'h-full rounded-full bg-primary transition-[width] duration-500 ease-out',
                        isIndeterminate && 'w-1/3 animate-pulse',
                        barClassName
                    )}
                    style={isIndeterminate ? undefined : { width: `${percent}%` }}
                />
            </div>
            <p className="my-0 text-[11px] font-medium text-slate-500 dark:text-zinc-400">{label}</p>
        </div>
    );
};
