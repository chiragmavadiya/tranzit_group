import type { ReactNode } from 'react'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface TemplateCardProps {
    value: string
    label: string
    description: string
    selected: boolean
    disabled?: boolean
    onSelect: (value: string) => void
    children?: ReactNode
}

/** Must be rendered inside a `RadioGroup` - keyboard nav comes from the radio primitive. */
export function TemplateCard({
    value,
    label,
    description,
    selected,
    disabled = false,
    onSelect,
    children
}: TemplateCardProps) {
    return (
        <div
            role="presentation"
            onClick={() => { if (!disabled) onSelect(value) }}
            className={cn(
                'flex flex-col rounded-md border p-4 transition-colors focus-within:ring-3 focus-within:ring-ring/50',
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                selected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40'
            )}
        >
            <div className="flex items-start gap-3">
                <RadioGroupItem value={value} disabled={disabled} className="mt-0.5 shrink-0" />
                <div className="min-w-0 space-y-1">
                    <span className={cn(
                        'block text-[13px] font-bold',
                        selected ? 'text-primary' : 'text-gray-900 dark:text-zinc-100'
                    )}>
                        {label}
                    </span>
                    <p className="my-0 text-[12px] leading-relaxed text-gray-500 dark:text-zinc-400">
                        {description}
                    </p>
                </div>
            </div>

            {children && (
                <div
                    role="presentation"
                    onClick={(event) => event.stopPropagation()}
                    className="mt-3 border-t border-primary/20 pt-1"
                >
                    {children}
                </div>
            )}
        </div>
    )
}
