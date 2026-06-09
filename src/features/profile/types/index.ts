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
}

export interface GetProfileResponse {
  status: boolean;
  message: string;
  data: ProfileDetails;
}
