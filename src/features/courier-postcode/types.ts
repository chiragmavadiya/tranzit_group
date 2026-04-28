export interface CourierPostcode {
    id: number;
    courier_name: string;
    global_courier_id: number;
    single_post_code: number;
    price: number;
}

export interface CourierPostcodeFormData {
    global_courier_id: number;
    single_post_code: number;
    price: number;
}

export interface CourierPostcodeFilters {
    search?: string;
    page: number;
    per_page: number;
}

