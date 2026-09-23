export interface CourierPostcode {
    id: number;
    courier_name: string;
    global_courier_id: number;
    single_post_code: number;
    suburb: string;
    price: number;
    courier_logo_url: string
}

export interface CourierPostcodeFormData {
    global_courier_id: number;
    single_post_code: number;
    suburb: string;
    price: number;
}

export interface CourierPostcodeFilters {
    search?: string;
    page: number;
    per_page: number;
}

