import { Clock3, PackageCheck, Ship, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ShippingActivity as ShippingActivityType } from '../../types/order-details.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export const ShippingActivity = ({ activity }: { activity: ShippingActivityType[] }) => (
    <Card className="border-border/60 bg-white shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 shadow-inner">
                    <Clock3 className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">Shipping Activity</CardTitle>
                    <CardDescription>
                        Live order milestones and shipment progress
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="px-6 py-8">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-slate-200">
                {activity.map((milestone, index) => {
                    const isLast = index === activity.length - 1
                    return (
                        <div key={`${milestone.title}-${milestone.date_time}`} className="relative flex items-start gap-6">
                            <div className={cn(
                                "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ring-1 ring-slate-200 transition-all",
                                isLast ? "bg-[#0060FE] text-white ring-blue-100" : "bg-white text-slate-400"
                            )}>
                                {isLast ? (
                                    <PackageCheck className="h-4 w-4" />
                                ) : index === 0 ? (
                                    <Ship className="h-4 w-4" />
                                ) : (
                                    <ShieldCheck className="h-4 w-4" />
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className={cn(
                                    "text-sm font-bold tracking-tight",
                                    isLast ? "text-[#0060FE]" : "text-slate-900"
                                )}>
                                    {milestone.title}
                                </p>
                                <p className="text-sm leading-relaxed text-slate-500 max-w-md">
                                    {milestone.description}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                        {milestone.date_time}
                                    </span>
                                    {isLast && (
                                        <Badge variant="secondary" className="h-5 rounded-md bg-blue-50 px-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                            Latest
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
)
