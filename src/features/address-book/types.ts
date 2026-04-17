export interface Address {
  id: number;
  code: string;
  customer_id: number;
  contact_person: string;
  business_name: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
  DT_RowIndex?: number;
}

export interface AddressFormData {
  id?: number;
  code: string;
  contact_person: string;
  business_name: string;
  email: string;
  phone?: string;
  address: string;
  unit_number?: string;
  street_number: string;
  street_name: string;
  street_type: string;
  suburb: string;
  state: string;
  postcode: string;
  additional_details?: string;
  special_instructions?: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressFilters {
  search: string;
  pageSize: number;
  page: number;
}
