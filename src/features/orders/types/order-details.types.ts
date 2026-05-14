export type OrderItem = {
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

export type ShippingActivity = {
    title: string
    description: string
    date_time: string
}

type CancelRequest = {
    customer_name: string,
    courier: string,
    label_no: string,
    requested_at: string,
    requested_by: string,
    refund_amount: number,
    processed_at: null,
    processed_by: ""
}

export type OrderDetailData = {
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
        address_detail: {
            address_line: string,
            suburb: string,
            state: string,
            postcode: string,
            country: string,
            street_name: string,
            street_number: string,
        }
        company?: string,
    }
    receiver_details: {
        name: string
        email: string
        mobile: string
        address: string
        address_detail: {
            address_line: string,
            suburb: string,
            state: string,
            postcode: string,
            country: string,
            street_name: string,
            street_number: string,
        }
        company?: string,
    }
    limited_liability_cover: {
        covered: boolean
        message: string
    }
    delivery_instructions: string
    order_status_category: string
    payment_status: string
    status: string
    shipping_activity: ShippingActivity[]
    cancel_request: CancelRequest | null
}
