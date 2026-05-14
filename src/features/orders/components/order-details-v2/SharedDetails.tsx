
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export const MetricCard = ({
    title,
    value,
    hint,
    icon: Icon,
    iconColor = 'text-primary',
    iconBg = 'bg-primary/10'
}: {
    title: string
    value: string
    hint: string
    icon: React.ComponentType<{ className?: string }>
    iconColor?: string
    iconBg?: string
}) => (
    <Card className="group border-border/60 bg-white shadow-sm transition-all hover:shadow-md hover:border-primary/20">
        <CardContent className="flex items-start justify-between px-5 py-5">
            <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
                    {title}
                </p>
                <p className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{value}</p>
                <p className="text-sm text-muted-foreground font-medium">{hint}</p>
            </div>
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110", iconBg)}>
                <Icon className={cn("h-6 w-6", iconColor)} />
            </div>
        </CardContent>
    </Card>
)

export const DetailBlock = ({
    label,
    value,
    mono = false,
    labelClassName,
    valueClassName
}: {
    label: string
    value: string
    mono?: boolean
    labelClassName?: string
    valueClassName?: string
}) => (
    <div className="space-y-1">
        <p
            className={cn(
                'text-xs font-medium tracking-widest text-muted-foreground',
                labelClassName
            )}
        >
            {label}
        </p>
        <p
            className={cn(
                'text-sm text-foreground',
                mono && 'font-mono text-[13px]',
                valueClassName
            )}
        >
            {value}
        </p>
    </div>
)
