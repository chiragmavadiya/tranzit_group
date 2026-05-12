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

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  mobile: string;
  work_email: string;
  personal_email: string;
  personal_mobile: string;
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
