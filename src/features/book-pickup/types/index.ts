export interface BookPickup {
    customer_name: string;
    order_number: string;
    amount: number;
    shipping_address: string;
    order_created_date: string;
    id: number;
}

export interface BookPickupResponse {
    status: boolean;
    message: string;
    data: BookPickup[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface BookPickupParams {
    book?: number;
    per_page?: number;
    page?: number;
    search?: string;
}

export interface CreatePickupRequest {
    ids: (string | number)[];
    type: "courier" | "ats";
    courier?: string;
}

export interface CreatePickupResponse {
    status: boolean;
    message: string;
}
