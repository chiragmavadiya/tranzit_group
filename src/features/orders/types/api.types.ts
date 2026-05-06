export interface CreateOrderRequest {
    sender: {
        name: string;
        company?: string;
        phone: string;
        email: string;
        address1: string;
        suburb: string;
        state: string;
        postcode: string;
        country: string;
        street_name?: string;
        street_number?: string;
    };
    receiver: {
        name: string;
        company?: string;
        phone: string;
        email: string;
        address1: string;
        suburb: string;
        state: string;
        postcode: string;
        country: string;
        street_name?: string;
        street_number?: string;
    };
    parcels: Array<{
        type: string;
        quantity: number;
        weight: number;
        length: number;
        width: number;
        height: number;
    }>;
    service: {
        courier: number;
        product_id: string;
        product_type: string;
        shipment_summary: string;
        cover_limited_liability: number;
        signature_required: number;
    };
    surcharges: any[];
    delivery_instructions?: string;
    pickup_date: string;
    terms_and_conditions: boolean;
    totals: {
        subtotal: number;
        gst: number;
        total: number;
        freight_levy?: number;
    };
    capture: boolean;
    save_address?: number;
}

export interface CreateOrderResponse {
    ok: boolean;
    order_number: string;
    redirect: string;
    tracking_number?: string;
}

export interface QuoteServicesRequest {
    sender_details: string;
    receiver_details: string;
    receiver_address: string;
    items: Array<{
        quantity: number;
        weight: number;
        length: number;
        width: number;
        height: number;
        type: string;
    }>;
    is_order: "yes" | "no";
}

export interface QuoteServicesResponse {
    services: Array<{
        carrier: string;
        carrier_id: number;
        courierCode: string;
        service_code: string;
        service_name: string;
        base: number;
        gst: number;
        withGST: number;
        customerQuotePrice: number;
        price: number;
        product_id: string;
        product_type: string;
        markup_charge: number;
        estimate_delivery_date: string;
        success: boolean;
        shipment_summary: string;
        image: string;
    }>;
    surcharges: Record<string, Array<{
        id: number;
        code: string;
        name: string;
        description: string;
        unit_type: string | null;
        direction: string | null;
        amount: number;
        min_amount: number | null;
        max_amount: number | null;
        tax_rate: string;
        meta: any;
        is_auto_apply: boolean;
        default_selected: boolean;
        is_customer_selectable: boolean;
    }>>;
}

export interface WalletCheckResponse {
    ok: boolean;
    wallet_balance: number;
    total: number;
    payment_capture: boolean;
}

export interface PaymentInfoResponse {
    status: boolean;
    message: string;
    data: {
        order_number: string;
        total_amount: number;
        paid_amount: number;
        balance_due: number;
        payment_status: string;
        payments: Array<{
            id: number;
            method: string;
            amount: number;
            external_txn_id: string | null;
            created_at: string;
        }>;
    };
}
