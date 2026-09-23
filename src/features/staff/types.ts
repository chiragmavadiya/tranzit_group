export interface StaffUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  personal_email?: string;
  personal_mobile?: string;
  mobile?: string;
  role: string;
  permissions?: string[];
  status: string | number | boolean;
  status_code?: string | number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StaffFormData {
  first_name: string;
  last_name: string;
  email: string;
  personal_email?: string;
  personal_mobile?: string;
  mobile?: string;
  password?: string;
  role: string;
  permissions?: string[];
  status?: string | number;
}

export interface StaffCountsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    inactive: number;
  };
}

export interface StaffFormOptionsResponse {
  success: boolean;
  data: {
    roles: string[];
    permissions: Array<{
      id: string;
      name: string;
      label: string;
      children?: Array<{
        id: string;
        name: string;
        label: string;
      }>;
    }>;
  };
}
