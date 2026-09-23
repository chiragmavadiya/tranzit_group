
import { UserRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailBlock } from './SharedDetails'

export const OrderSummary = ({
    orderNumber,
    orderType,
    createdAt,
    status,
    paymentStatus
}: {
    orderNumber: string
    orderType: string
    createdAt: string
    status: string
    paymentStatus: string
}) => (
    <Card className="border-border/60 bg-white shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <UserRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                    <CardDescription>
                        Quick view of current order state
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5">
            <DetailBlock label="Order Number" value={orderNumber} />
            <DetailBlock label="Order Type" value={orderType} />
            <DetailBlock label="Created" value={createdAt} />
            <DetailBlock label="Status" value={status} />
            <DetailBlock label="Payment Status" value={paymentStatus} />
        </CardContent>
    </Card>
)
