export interface TeamUser {
  id: number | string;
  first_name: string;
  last_name?: string;
  name?: string;
  email: string;
  role: string;
  status: string;
  created_at?: string;
  createdAt?: string;
  order_creation_email_received?: boolean;
  permissions?: Record<string, Record<string, boolean>> | any;
}

export interface TeamUserFormData {
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  order_creation_email_received?: boolean;
  permissions?: Record<string, Record<string, boolean>> | any;
}
