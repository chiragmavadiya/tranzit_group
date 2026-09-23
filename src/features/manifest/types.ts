export interface Manifest {
  customer_name: string;
  order_number: string;
  suburb: string | null;
  amount: string | number;
  status: string;
  payment_status: string;
  courier: string;
  order_type: string;
  consignment_date: string;
  courier_logo?: string;
  courier_logo_url?: string;
  product_id?: string;
  customer_full_address?: string;
  receiver_email?: string;
  receiver_phone?: string;
  order_source_icon?: string;
  is_own_courier: boolean;
  sender_address_info?: string;
  receiver_address_info?: string;
  courier_code?: string;
  pdf_url: string;
}

export interface ManifestFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ManifestResponse {
  status: boolean;
  message: string;
  data: Manifest[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
