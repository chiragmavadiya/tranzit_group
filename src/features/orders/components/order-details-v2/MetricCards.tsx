
import { ArrowUpRight, CreditCard, PackageOpen, Truck } from 'lucide-react'
import { MetricCard } from './SharedDetails'
import type { OrderDetailData } from '../../types/order-details.types'
import { formatCurrency, formatMeasure } from '../../utils/order-details.utils'

export const MetricCards = ({ data }: { data: OrderDetailData }) => {
    const itemCount = data.order_details.items.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const totalWeight = data.order_details.items.reduce(
        (total, item) => total + item.weight * item.quantity,
        0
    )

    return (
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <MetricCard
                title="Order Total"
                value={formatCurrency(data.order_details.total)}
                hint={`${formatCurrency(data.order_details.paid)} paid so far`}
                icon={CreditCard}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
            />
            <MetricCard
                title="Balance Due"
                value={formatCurrency(data.order_details.balance_due)}
                hint={`Subtotal ${formatCurrency(data.order_details.subtotal)} + tax ${formatCurrency(data.order_details.tax)}`}
                icon={ArrowUpRight}
                iconColor="text-rose-600"
                iconBg="bg-rose-50"
            />
            <MetricCard
                title="Items"
                value={`${itemCount}`}
                hint={`${data.order_details.items.length} line items`}
                icon={PackageOpen}
                iconColor="text-amber-600"
                iconBg="bg-amber-50"
            />
            <MetricCard
                title="Shipment Weight"
                value={formatMeasure(totalWeight, 'kg')}
                hint={`${data.courier_details.courier}`}
                icon={Truck}
                iconColor="text-primary"
                iconBg="bg-primary/10"
            />
        </section>
    )
}
