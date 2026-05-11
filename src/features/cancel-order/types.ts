export interface CancelOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    courier: string;
    label_no: string;
    refund_amount: number;
    request_submitted_at: string;
    submitted_by: string;
    processed_at: string | null;
    processed_by: string;
    status: string;
}

export interface CancelOrderSummary {
    pending: number;
    processed: number;
}

export interface CancelOrderFilters {
    status?: 'pending' | 'processed' | string;
    search?: string;
    per_page?: number;
    page?: number;
}

export interface CancelOrderResponse {
    status: boolean;
    message: string;
    data: CancelOrder[];
    summary: CancelOrderSummary;
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}
