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
