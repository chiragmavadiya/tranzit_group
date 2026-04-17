
import { Truck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailBlock } from './SharedDetails'

export const CourierSnapshot = ({
    courier,
    trackingNumber,
    reference,
    instructions
}: {
    courier: string
    trackingNumber: string
    reference: string
    instructions: string
}) => (
    <Card className="border-border/60 bg-white shadow-sm gap-1">
        <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-lg">Courier Snapshot</CardTitle>
            <CardDescription className="text-muted-foreground">
                Shipment routing and reference information
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 pt-5 pb-1">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-700">
                    <Truck className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.18em]">
                        Courier
                    </p>
                    <p className="text-sm font-semibold">{courier}</p>
                </div>
            </div>
            <DetailBlock
                label="Tracking Number"
                value={trackingNumber}
                mono
            />
            <DetailBlock
                label="Customer Reference"
                value={reference}
            />
            <div className="rounded-2xl border border-gray/10 bg-white/5 px-4 py-4">
                <p className="text-xl">
                    Delivery Instructions
                </p>
                <p className="mt-2 text-sm">
                    {instructions}
                </p>
            </div>
        </CardContent>
    </Card>
)
