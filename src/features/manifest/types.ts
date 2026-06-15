export interface Manifest {
  id: string | number;
  manifest_number: string;
  courier_name: string;
  courier_code: string;
  total_consignments: number;
  status: string;
  created_at: string;
  manifest_pdf_url?: string;
  actions: string[];
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
