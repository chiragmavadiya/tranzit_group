import { ORDER_DATA } from '../constants/order-details.constants'
import { OrderHeader as V2OrderHeader } from '../components/order-details-v2/V2OrderHeader'
import { MetricCards } from '../components/order-details-v2/MetricCards'
import { OrderItemsTable } from '../components/order-details-v2/OrderItemsTable'
import { ContactCard } from '../components/order-details-v2/ContactCard'
import { ShippingActivity } from '../components/order-details-v2/ShippingActivity'
import { CourierSnapshot } from '../components/order-details-v2/CourierSnapshot'
import { LiabilityCover } from '../components/order-details-v2/LiabilityCover'
import { FinancialSummary } from '../components/order-details-v2/FinancialSummary'
import { OrderSummary } from '../components/order-details-v2/OrderSummary'

const OrderDetails2: React.FC = () => {
    return (
        <div className="min-h-0 p-page-padding text-foreground overflow-auto">
            <div className="mx-auto flex w-full flex-col gap-6">
                <V2OrderHeader data={ORDER_DATA} />

                <MetricCards data={ORDER_DATA} />

                <main className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                    <div className="space-y-6">
                        <OrderItemsTable items={ORDER_DATA.order_details.items} />

                        <div className="grid gap-6 lg:grid-cols-2">
                            <ContactCard
                                title="Sender Details"
                                name={ORDER_DATA.sender_details.name}
                                meta={`Customer ID #${ORDER_DATA.sender_details.customer_id}`}
                                email={ORDER_DATA.sender_details.email}
                                mobile={ORDER_DATA.sender_details.mobile}
                                address={ORDER_DATA.sender_details.address}
                            />

                            <ContactCard
                                title="Receiver Details"
                                name={ORDER_DATA.receiver_details.name}
                                email={ORDER_DATA.receiver_details.email}
                                mobile={ORDER_DATA.receiver_details.mobile}
                                address={ORDER_DATA.receiver_details.address}
                            />
                        </div>

                        <ShippingActivity activity={ORDER_DATA.shipping_activity} />
                    </div>

                    <aside className="space-y-6">
                        <CourierSnapshot
                            courier={ORDER_DATA.courier_details.courier}
                            trackingNumber={ORDER_DATA.courier_details.tracking_number}
                            reference={ORDER_DATA.courier_details.customer_reference}
                            instructions={ORDER_DATA.delivery_instructions}
                        />

                        <LiabilityCover
                            covered={ORDER_DATA.limited_liability_cover.covered}
                            message={ORDER_DATA.limited_liability_cover.message}
                        />

                        <FinancialSummary
                            subtotal={ORDER_DATA.order_details.subtotal}
                            tax={ORDER_DATA.order_details.tax}
                            total={ORDER_DATA.order_details.total}
                            paid={ORDER_DATA.order_details.paid}
                            balanceDue={ORDER_DATA.order_details.balance_due}
                        />

                        <OrderSummary
                            orderNumber={ORDER_DATA.order_number}
                            orderType={ORDER_DATA.order_type}
                            createdAt={ORDER_DATA.created_at}
                            status={ORDER_DATA.status}
                            paymentStatus={ORDER_DATA.payment_status}
                        />
                    </aside>
                </main>
            </div>
        </div>
    )
}

export default OrderDetails2