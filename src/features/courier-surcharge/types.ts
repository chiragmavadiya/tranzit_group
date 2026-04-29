export interface CourierSurcharge {
  id: number;
  courier_name: string;
  code: string;
  name: string;
  description: string;
  charge_basis: string;
  applies_on: string;
  amount_ex_gst: number;
  default_selected: boolean;
  is_auto_apply: boolean;
  is_customer_selectable: boolean;
}

export interface CourierSurchargeFormData {
  global_courier_id: number;
  code: string;
  name: string;
  description: string;
  charge_basis: string;
  applies_on: string;
  amount_ex_gst: number;
  is_customer_selectable: boolean;
  default_selected: boolean;
  is_auto_apply: boolean;
}

export interface CourierSurchargeFilters {
  page?: number;
  per_page?: number;
  search?: string;
}
