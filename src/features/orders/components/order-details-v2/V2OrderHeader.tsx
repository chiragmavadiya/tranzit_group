
import { Copy, Check, ExternalLink, ChevronRight, FileDown, Rocket, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OrderDetailData } from '../../types/order-details.types'
import { STATUS_TONE_MAP, PAYMENT_TONE_MAP } from '../../constants/order-details.constants'
import { useDownloadLabel } from '../../hooks/useOrders'
import { showToast } from '@/components/ui/custom-toast'

export const OrderHeader = ({ data }: { data: OrderDetailData }) => {
    const [copiedTracking, setCopiedTracking] = useState(false)
    const [copiedOrder, setCopiedOrder] = useState(false)

    const downloadLabel = useDownloadLabel();

    const statusTone =
        STATUS_TONE_MAP[data.status.toLowerCase()] ??
        'bg-slate-950/5 text-slate-700 ring-slate-950/10'

    const paymentTone =
        PAYMENT_TONE_MAP[data.payment_status.toLowerCase()] ??
        'bg-slate-950/5 text-slate-700 ring-slate-950/10'

    const copyToClipboard = (text: string, type: 'order' | 'tracking') => {
        navigator.clipboard.writeText(text)
        if (type === 'order') setCopiedOrder(true)
        else setCopiedTracking(true)
        showToast(`${type === 'order' ? 'Order number' : 'Tracking number'} copied to clipboard`, "success");
        setTimeout(() => {
            if (type === 'order') setCopiedOrder(false)
            else setCopiedTracking(false)
        }, 2000)
    }

    const handleDownloadLabel = () => {
        downloadLabel.mutate(data.order_number, {
            onError: (error: any) => {
                showToast(error?.response?.data?.message || 'Failed to download label', "error");
            }
        });
    }

    return (
        <section className="space-y-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground ml-1">
                <span>Orders</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">Order Details</span>
            </nav>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge className="h-7 rounded-full bg-slate-950 px-3 text-white hover:bg-slate-950">
                                    {data.order_type}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={cn('h-7 rounded-full border-0 px-3 ring-1 font-medium', statusTone)}
                                >
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                                    {data.status}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={cn('h-7 rounded-full border-0 px-3 ring-1 font-medium', paymentTone)}
                                >
                                    {data.payment_status}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                        Order {data.order_number}
                                    </h1>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-slate-100"
                                        onClick={() => copyToClipboard(data.order_number, 'order')}
                                    >
                                        {copiedOrder ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                                    </Button>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                    <span className="font-medium text-slate-700">{data.created_human}</span>
                                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                                    <span>{data.created_at}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="group min-w-[240px] rounded-2xl border border-blue-100 bg-blue-50/50 p-4 transition-all hover:bg-blue-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600/70">
                                            Tracking Number
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-md hover:bg-blue-100"
                                                onClick={() => copyToClipboard(data.courier_details.tracking_number, 'tracking')}
                                            >
                                                {copiedTracking ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-blue-400" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-blue-100">
                                                <ExternalLink className="h-3 w-3 text-blue-400" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mt-1 font-mono text-base font-bold text-blue-900">
                                        {data.courier_details.tracking_number}
                                    </p>
                                </div>
                                <div className="min-w-[240px] rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:bg-slate-100/80">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        Customer Reference
                                    </p>
                                    <p className="mt-1 text-base font-bold text-slate-900">
                                        {data.courier_details.customer_reference}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                            <Button className="h-11 rounded-xl bg-[#0060FE] hover:bg-blue-700 px-6 text-white shadow-lg shadow-blue-500/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px]">
                                <Rocket className="mr-2 h-4 w-4" />
                                Generate Consignment
                            </Button>
                            <Button
                                variant="outline"
                                className="h-11 rounded-xl border-slate-200 px-6 font-medium shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                                onClick={handleDownloadLabel}
                                disabled={downloadLabel.isPending}
                            >
                                {downloadLabel.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
                                ) : (
                                    <FileDown className="mr-2 h-4 w-4 text-slate-500" />
                                )}
                                {downloadLabel.isPending ? 'Downloading...' : 'Download Label'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
