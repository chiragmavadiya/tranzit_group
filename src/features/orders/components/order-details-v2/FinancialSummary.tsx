
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '../../utils/order-details.utils'

export const FinancialSummary = ({
    subtotal,
    tax,
    total,
    paid,
    balanceDue
}: {
    subtotal: number
    tax: number
    total: number
    paid: number
    balanceDue: number
}) => (
    <Card className="border-border/60 bg-white shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-lg">Financial Summary</CardTitle>
            <CardDescription>
                Order charges and payment breakdown
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5">
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium">{formatCurrency(paid)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(total)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Balance Due</span>
                    <span className="text-lg font-semibold text-amber-700">
                        {formatCurrency(balanceDue)}
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
)
