export interface AuspostOrder {
  order_number: string;
  customer_name: string;
  suburb: string;
  postcode: string;
  order_date: string;
}

export interface AuspostOrderFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface AuspostOrderResponse {
  status: boolean;
  message: string;
  data: AuspostOrder[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
