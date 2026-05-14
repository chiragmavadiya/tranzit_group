import { useParams } from 'react-router-dom'
import { OrderHeader as V2OrderHeader } from '../components/order-details-v2/V2OrderHeader'
import { MetricCards } from '../components/order-details-v2/MetricCards'
import { OrderItemsTable } from '../components/order-details-v2/OrderItemsTable'
import { ContactCard } from '../components/order-details-v2/ContactCard'
import { ShippingActivity } from '../components/order-details-v2/ShippingActivity'
import { CourierSnapshot } from '../components/order-details-v2/CourierSnapshot'
import { LiabilityCover } from '../components/order-details-v2/LiabilityCover'
import { FinancialSummary } from '../components/order-details-v2/FinancialSummary'
import { OrderSummary } from '../components/order-details-v2/OrderSummary'
import { useOrderDetails } from '../hooks/useOrders'
import { Loader2 } from 'lucide-react'

const OrderDetails2: React.FC = () => {
  const { orderID } = useParams();
  const { data: ordersData, isLoading } = useOrderDetails(orderID as string);
  const data = ordersData?.data;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-gray-500">
        Order not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="min-h-0 p-page-padding text-foreground overflow-auto">
      <div className="mx-auto flex w-full flex-col gap-6">
        <V2OrderHeader data={data} />

        <MetricCards data={data} />

        <main className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="space-y-6">
            <OrderItemsTable items={data.order_details.items} />

            <div className="grid gap-6 lg:grid-cols-2">
              <ContactCard
                title="Sender Details"
                name={data.sender_details.name}
                meta={`Customer ID #${data.sender_details.customer_id}`}
                email={data.sender_details.email}
                mobile={data.sender_details.mobile}
                address={data.sender_details.address}
              />

              <ContactCard
                title="Receiver Details"
                name={data.receiver_details.name}
                email={data.receiver_details.email}
                mobile={data.receiver_details.mobile}
                address={data.receiver_details.address}
              />
            </div>

            <ShippingActivity activity={data.shipping_activity} />
          </div>

          <aside className="space-y-6">
            <CourierSnapshot
              courier={data.courier_details.courier}
              trackingNumber={data.courier_details.tracking_number}
              reference={data.courier_details.customer_reference}
              instructions={data.delivery_instructions}
            />

            <LiabilityCover
              covered={data.limited_liability_cover.covered}
              message={data.limited_liability_cover.message}
            />

            <FinancialSummary
              subtotal={data.order_details.subtotal}
              tax={data.order_details.tax}
              total={data.order_details.total}
              paid={data.order_details.paid}
              balanceDue={data.order_details.balance_due}
            />

            <OrderSummary
              orderNumber={data.order_number}
              orderType={data.order_type}
              createdAt={data.created_at}
              status={data.status}
              paymentStatus={data.payment_status}
            />
          </aside>
        </main>
      </div>
    </div>
  )
}

export default OrderDetails2