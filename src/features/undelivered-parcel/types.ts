export interface UndeliveredParcel {
  tracking_number: string;
  customer_name: string;
  suburb: string;
  postcode: string;
}

export interface UndeliveredParcelFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UndeliveredParcelResponse {
  status: boolean;
  message: string;
  data: UndeliveredParcel[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
