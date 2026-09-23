/** GET /customer/tracking-page/settings — every field is null until first saved. */
export interface TrackingPageSettings {
  logo: string | null;
  brand_url: string | null;
  header_color: string | null;
}

export interface TrackingPageSettingsResponse {
  status: boolean;
  message: string;
  data: TrackingPageSettings;
}

/**
 * Partial update. Only changed keys are present: `logo` is never null, `remove_logo` is
 * never false, and an explicit null clears a text field.
 */
export interface TrackingPageSettingsUpdate {
  logo?: File;
  remove_logo?: true;
  brand_url?: string | null;
  header_color?: string | null;
}

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
