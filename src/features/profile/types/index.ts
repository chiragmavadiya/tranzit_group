export interface ProfileData {
  businessName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  loginEmail: string;
  personalEmail: string;
  personalMobile: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddressDetailItem {
  address: string;
  unit_number?: string;
  street_number?: string;
  street_name?: string;
  street_type?: string;
  suburb: string;
  state: string;
  postcode: string;
  latitude?: number | null;
  longitude?: number | null;
  address_info?: string;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  mobile: string;
  work_email?: string;
  personal_email?: string | null;
  personal_mobile?: string;
  business_name?: string;
  gst_number?: string;
  address_detail?: {
    default?: AddressDetailItem;
    billing?: AddressDetailItem;
  };
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
}

export interface WeeklyLabelUsageTier {
  min: number;
  max: number;
  rate: number | string;
  label: string;
}

export interface WeeklyLabelUsage {
  week_start: string;
  week_end: string;
  byo_labels_printed: number;
  tr_labels_printed: number;
  total_labels_printed: number;
  current_tier: WeeklyLabelUsageTier;
  next_tier: WeeklyLabelUsageTier | null;
  labels_needed_for_next_tier: number;
}

export interface ProfileDetails {
  id?: number;
  first_name: string;
  last_name: string;
  mobile?: string;
  personal_email?: string | null;
  business_name: string;
  gst_number: string;
  email?: string;
  personal_mobile?: string;
  address_detail?: {
    default?: AddressDetailItem;
    billing?: AddressDetailItem;
  };
  weekly_label_usage?: WeeklyLabelUsage;
}

export interface GetProfileResponse {
  status: boolean;
  message: string;
  data: ProfileDetails;
  user?: any;
  address_detail?: any;
  default_item?: any;
  default_courier?: any;
  announcements?: {
    id: number;
    text: string;
    text_color: string;
    background_color: string;
    expire_date: string;
  }[];
  email_verified?: boolean;
  next_step?: string;
  is_onboarded?: boolean;
}
