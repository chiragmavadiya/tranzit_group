export interface Address {
  id: number;
  code: string;
  contact_person: string;
  business_name: string;
  email_id: string;
  mobile: string;
  address: string;
  is_active: number;
  DT_RowIndex?: number;
}

export interface AddressFormData {
  id?: number;
  code: string;
  contact_person: string;
  business_name: string;
  email_id: string;
  mobile: string;
  address: string;
}

export interface AddressFilters {
  search: string;
  pageSize: number;
  page: number;
}
