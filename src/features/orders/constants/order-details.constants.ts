import type { OrderDetailData } from '../types/order-details.types';

export const ORDER_DATA: OrderDetailData = {
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

export const STATUS_TONE_MAP: Record<string, string> = {
    'ready for dispatch': 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-700 ring-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-700 ring-amber-500/20'
}

export const PAYMENT_TONE_MAP: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    'partially paid': 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
    unpaid: 'bg-rose-500/10 text-rose-700 ring-rose-500/20'
}
