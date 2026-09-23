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

export type ShopifyItem = {
    product_name: string
    variant_title?: string | null
<<<<<<< HEAD
    variant_id?: number | null
    product_id?: number | null
    sku?: string | null
    quantity: number
    price: number
    weight: number
    weight_unit?: string | null
=======
    sku?: string | null
    quantity: number
    price: number
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
}

export type OrderDetailData = {
    order_number: string
    need_add_tracking?: boolean
    order_type: string
    created_at: string
    created_human: string
    order_reference: string
    customer_reference?: string | null
    external_reference?: string | null
    external_order_id?: string | null
<<<<<<< HEAD
    /** Shipping the buyer picked and paid for on the sales platform, e.g. Shopify checkout. */
    platform_shipping_method?: string | null
    platform_shipping_price?: number | null
    platform_shipping_currency?: string | null
    fulfillment_status?: string | null
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    order_details: {
        subtotal: number
        tax: number
        total: number
        paid: number
        balance_due: number
        items: OrderItem[]
        surcharge_amount: number
        shopify_items?: ShopifyItem[]
<<<<<<< HEAD
        shopify_note?: string | null
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    }
    courier_details: {
        courier: string
        tracking_number: string
        customer_reference: string
        product_id: string
        courier_code: string
        is_own_courier: boolean
        external_reference?: string | null
        external_order_id?: string | null
        tracking_url?: string | null
    }
    /**
     * Raw rate/booking payload echoed back by the courier. Admin-only diagnostic data, and
     * the keys differ per courier, so it is rendered generically rather than field by field.
     */
    courier_response?: Record<string, unknown> | null
    sender_details: {
        name: string
        customer_id: number
        email: string
        mobile: string
        address: string
        address_detail: {
            address_line: string,
            address_info: string,
            suburb: string,
            state: string,
            postcode: string,
            country: string,
            street_name: string,
            street_number: string,
            unit_number: string,
            street?: string,
            building?: string,
            instructions?: string
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
            address_info: string,
            suburb: string,
            state: string,
            postcode: string,
            country: string,
            street_name: string,
            street_number: string,
            street_type: string,
            city: string,
            street?: string,
            building?: string,
            instructions?: string,
            unit_number: string,
        }
        company?: string,
    }
    limited_liability_cover: {
        covered: boolean
        message: string
    }
    delivery_instructions: string
<<<<<<< HEAD
    contains_dangerous_goods?: boolean
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
    order_status_category: string
    payment_status: string
    status: string
    signature_required: string
    shipping_activity: ShippingActivity[]
    cancel_request: CancelRequest | null
    customer_id: number
    tracking_status: string
    transit_timeline?: {
        events: any[]
    }
}
