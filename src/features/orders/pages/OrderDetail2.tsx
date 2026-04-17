import React from 'react'
import {
  ArrowUpRight,
  Box,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  PackageOpen,
  Shield,
  Truck,
  UserRound
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type OrderItem = {
  id: number
  type: string
  description: string | null
  display_name: string
  quantity: number
  weight: number
  length: number
  width: number
  height: number
}

type ShippingActivity = {
  title: string
  description: string
  date_time: string
}

type OrderDetailData = {
  order_number: string
  order_type: string
  created_at: string
  created_human: string
  order_details: {
    subtotal: number
    tax: number
    total: number
    paid: number
    balance_due: number
    items: OrderItem[]
  }
  courier_details: {
    courier: string
    tracking_number: string
    customer_reference: string
  }
  sender_details: {
    name: string
    customer_id: number
    email: string
    mobile: string
    address: string
  }
  receiver_details: {
    name: string
    email: string
    mobile: string
    address: string
  }
  limited_liability_cover: {
    covered: boolean
    message: string
  }
  delivery_instructions: string
  payment_status: string
  status: string
  shipping_activity: ShippingActivity[]
}

const orderData: OrderDetailData = {
  order_number: '#01KDYJ5P3737Z5N0Q8PV2F67NY',
  order_type: 'Shopify',
  created_at: '2026-01-22T04:16:00Z',
  created_human: 'Created 3 months ago',
  order_details: {
    subtotal: 159.0,
    tax: 15.9,
    total: 174.9,
    paid: 100.0,
    balance_due: 74.9,
    items: [
      {
        id: 1,
        type: 'Parcel',
        description: 'Folded apparel order packed in recycled mailer.',
        display_name: 'Premium Tee Bundle',
        quantity: 2,
        weight: 1.4,
        length: 28,
        width: 20,
        height: 8
      },
      {
        id: 2,
        type: 'Parcel',
        description: 'Branded cap with gift wrap.',
        display_name: 'Transit Cap',
        quantity: 1,
        weight: 0.5,
        length: 22,
        width: 18,
        height: 10
      }
    ]
  },
  courier_details: {
    courier: 'Australia Post Express',
    tracking_number: 'EXT11866349863277',
    customer_reference: 'SHOP-11866349863277'
  },
  sender_details: {
    name: 'Customer1 User',
    customer_id: 2,
    email: 'customer1@example.com',
    mobile: '0423692115',
    address: '123 Main St Melbourne, VIC 3000'
  },
  receiver_details: {
    name: 'Shikhar C',
    email: 'sikher111@example.com',
    mobile: '0412345678',
    address: '150 Collins Street Melbourne, VIC 3000'
  },
  limited_liability_cover: {
    covered: false,
    message: 'This consignment is currently not covered by any limited liability protection.'
  },
  delivery_instructions: 'Leave parcel at the front desk if the receiver is unavailable.',
  payment_status: 'Partially Paid',
  status: 'Ready for dispatch',
  shipping_activity: [
    {
      title: 'Imported from Shopify',
      description: 'Order #11866349863277 synchronized from the Shopify store.',
      date_time: '02 Jan 2026, 04:16 PM'
    },
    {
      title: 'Label data verified',
      description: 'Sender, receiver, and package dimensions validated successfully.',
      date_time: '02 Jan 2026, 04:24 PM'
    },
    {
      title: 'Awaiting courier pickup',
      description: 'Shipment is packed and queued for courier handoff.',
      date_time: '03 Jan 2026, 09:10 AM'
    }
  ]
}

const currencyFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD'
})

const numberFormatter = new Intl.NumberFormat('en-AU', {
  maximumFractionDigits: 2
})

const formatCurrency = (value: number) => currencyFormatter.format(value)

const formatMeasure = (value: number, unit: string) =>
  `${numberFormatter.format(value)} ${unit}`

const statusToneMap: Record<string, string> = {
  'ready for dispatch': 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-700 ring-rose-500/20',
  pending: 'bg-amber-500/10 text-amber-700 ring-amber-500/20'
}

const paymentToneMap: Record<string, string> = {
  paid: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
  'partially paid': 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
  unpaid: 'bg-rose-500/10 text-rose-700 ring-rose-500/20'
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const MetricCard = ({
  title,
  value,
  hint,
  icon: Icon
}: {
  title: string
  value: string
  hint: string
  icon: React.ComponentType<{ className?: string }>
}) => (
  <Card className="border-border/60 bg-white shadow-sm">
    <CardContent className="flex items-start justify-between px-5 py-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
)

const DetailBlock = ({
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
        'text-xs font-medium  tracking-widest text-muted-foreground',
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

const ContactCard = ({
  title,
  name,
  meta,
  email,
  mobile,
  address
}: {
  title: string
  name: string
  meta?: string
  email: string
  mobile: string
  address: string
}) => (
  <Card className="border-border/60 bg-white shadow-sm">
    <CardHeader className="border-b border-border/60 pb-4">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>Contact and address information</CardDescription>
    </CardHeader>
    <CardContent className="space-y-5 px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-700">
          <span className="text-sm font-semibold">{getInitials(name)}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailBlock label="Email" value={email} />
        <DetailBlock label="Mobile" value={mobile || 'Not provided'} />
      </div>
      <div className="rounded-2xl border border-border/60 bg-slate-50 px-4 py-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-cyan-700" />
          Address
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{address}</p>
      </div>
    </CardContent>
  </Card>
)

const OrderDetail2: React.FC = () => {
  const itemCount = orderData.order_details.items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalWeight = orderData.order_details.items.reduce(
    (total, item) => total + item.weight * item.quantity,
    0
  )

  const statusTone =
    statusToneMap[orderData.status.toLowerCase()] ??
    'bg-slate-950/5 text-slate-700 ring-slate-950/10'

  const paymentTone =
    paymentToneMap[orderData.payment_status.toLowerCase()] ??
    'bg-slate-950/5 text-slate-700 ring-slate-950/10'
// 0060fe38
  return (
    <div className="min-h-0 p-page-padding bg-[linear-gradient(180deg,#f7fafc_0%,#eef4f8_38%,#f8fafc_100%)] text-foreground overflow-auto">
      <div className="mx-auto flex w-full flex-col gap-6">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]">
          <div className="relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0060fe17,_transparent_28%),radial-gradient(circle_at_left,#0060fe17,_transparent_14%)]" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="h-7 rounded-full bg-slate-950 px-3 text-white hover:bg-slate-950">
                    {orderData.order_type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('h-7 rounded-full border-0 px-3 ring-1', statusTone)}
                  >
                    {orderData.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('h-7 rounded-full border-0 px-3 ring-1', paymentTone)}
                  >
                    {orderData.payment_status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Order {orderData.order_number}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{orderData.created_human}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                    <span>{orderData.created_at}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="min-w-[220px] rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                    <p className="text-xs font-medium  text-cyan-700">
                      Tracking Number
                    </p>
                    <p className="mt-1 font-mono text-base font-semibold text-cyan-950">
                      {orderData.courier_details.tracking_number}
                    </p>
                  </div>
                  <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium  text-slate-500">
                      Customer Reference
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {orderData.courier_details.customer_reference}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <Button className="h-11 rounded-xl bg-primary px-5 text-white">
                  Generate Consignment
                </Button>
                <Button variant="outline" className="h-11 rounded-xl px-5">
                  Download Label
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            title="Order Total"
            value={formatCurrency(orderData.order_details.total)}
            hint={`${formatCurrency(orderData.order_details.paid)} paid so far`}
            icon={CreditCard}
          />
          <MetricCard
            title="Balance Due"
            value={formatCurrency(orderData.order_details.balance_due)}
            hint={`Subtotal ${formatCurrency(orderData.order_details.subtotal)} + tax ${formatCurrency(orderData.order_details.tax)}`}
            icon={ArrowUpRight}
          />
          <MetricCard
            title="Items"
            value={`${itemCount}`}
            hint={`${orderData.order_details.items.length} line items`}
            icon={PackageOpen}
          />
          <MetricCard
            title="Shipment Weight"
            value={formatMeasure(totalWeight, 'kg')}
            hint={`${orderData.courier_details.courier}`}
            icon={Truck}
          />
        </section>

        <main className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="space-y-6">
            <Card className="border-border/60 bg-white shadow-sm">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Order Items</CardTitle>
                    <CardDescription>
                      Package contents, quantities, and dimensions
                    </CardDescription>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                    <Box className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/60 bg-slate-50/80 hover:bg-slate-50/80">
                        <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Item
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Type
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Qty
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Weight
                        </TableHead>
                        <TableHead className="px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Dimensions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderData.order_details.items.map((item) => (
                        <TableRow
                          key={item.id}
                          className="border-border/60 hover:bg-slate-50/60"
                        >
                          <TableCell className="px-5 py-4 align-top whitespace-normal">
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">
                                {item.display_name}
                              </p>
                              <p className="text-sm leading-6 text-muted-foreground">
                                {item.description || 'No description provided.'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4">{item.type}</TableCell>
                          <TableCell className="px-5 py-4">{item.quantity}</TableCell>
                          <TableCell className="px-5 py-4">
                            {formatMeasure(item.weight, 'kg')}
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            {item.length} x {item.width} x {item.height} cm
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <ContactCard
                title="Sender Details"
                name={orderData.sender_details.name}
                meta={`Customer ID #${orderData.sender_details.customer_id}`}
                email={orderData.sender_details.email}
                mobile={orderData.sender_details.mobile}
                address={orderData.sender_details.address}
              />

              <ContactCard
                title="Receiver Details"
                name={orderData.receiver_details.name}
                email={orderData.receiver_details.email}
                mobile={orderData.receiver_details.mobile}
                address={orderData.receiver_details.address}
              />
            </div>

            <Card className="border-border/60 bg-white shadow-sm">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-700">
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
              <CardContent className="px-5 py-6">
                <div className="space-y-6">
                  {orderData.shipping_activity.map((activity, index) => (
                    <div key={`${activity.title}-${activity.date_time}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 ">
                          {index === orderData.shipping_activity.length - 1 ? (
                            <PackageCheck className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        {index !== orderData.shipping_activity.length - 1 ? (
                          <div className="mt-2 h-full w-px bg-slate-200" />
                        ) : null}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-semibold text-foreground">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {activity.date_time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-border/60 bg-white shadow-sm">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-lg">Courier Snapshot</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Shipment routing and reference information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-5 py-5">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-700">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] ">
                      Courier
                    </p>
                    <p className="text-sm font-semibold">{orderData.courier_details.courier}</p>
                  </div>
                </div>
                <DetailBlock
                  label="Tracking Number"
                  value={orderData.courier_details.tracking_number}
                  mono
                  labelClassName=""
                  valueClassName=""
                />
                <DetailBlock
                  label="Customer Reference"
                  value={orderData.courier_details.customer_reference}
                  labelClassName=""
                  valueClassName=""
                />
                <div className="rounded-2xl border border-gray/10 bg-white/5 px-4 py-4">
                  <p className="text-xl">
                    Delivery Instructions
                  </p>
                  <p className="mt-2 text-sm">
                    {orderData.delivery_instructions}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-white shadow-sm">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl',
                      orderData.limited_liability_cover.covered
                        ? 'bg-emerald-500/15 text-emerald-700'
                        : 'bg-amber-500/15 text-amber-700'
                    )}
                  >
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Limited Liability Cover</CardTitle>
                    <CardDescription>
                      Coverage status for the active consignment
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 py-5">
                <Badge
                  variant="outline"
                  className={cn(
                    'h-7 rounded-full border-0 px-3 ring-1',
                    orderData.limited_liability_cover.covered
                      ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-700 ring-amber-500/20'
                  )}
                >
                  {orderData.limited_liability_cover.covered ? 'Covered' : 'Not Covered'}
                </Badge>
                <p className="text-sm leading-6 text-muted-foreground">
                  {orderData.limited_liability_cover.message}
                </p>
              </CardContent>
            </Card>

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
                    <span className="font-medium">{formatCurrency(orderData.order_details.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatCurrency(orderData.order_details.tax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium">{formatCurrency(orderData.order_details.paid)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">
                      {formatCurrency(orderData.order_details.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Balance Due</span>
                    <span className="text-lg font-semibold text-amber-700">
                      {formatCurrency(orderData.order_details.balance_due)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-white shadow-sm">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
                    <UserRound className="h-5 w-5" />
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
                <DetailBlock label="Order Number" value={orderData.order_number} />
                <DetailBlock label="Order Type" value={orderData.order_type} />
                <DetailBlock label="Created" value={orderData.created_at} />
                <DetailBlock label="Status" value={orderData.status} />
                <DetailBlock label="Payment Status" value={orderData.payment_status} />
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default OrderDetail2
