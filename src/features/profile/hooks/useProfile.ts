import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../types";
import { showToast } from "@/components/ui/custom-toast";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Profile updated successfully", "success");
        // Invalidate user details to reflect changes across the app
        queryClient.invalidateQueries({ queryKey: ["auth", "user-details"] });
      } else {
        showToast(response.message || "Failed to update profile", "error");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "An error occurred while updating profile", "error");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || "Password changed successfully", "success");
      } else {
        showToast(response.message || "Failed to change password", "error");
      }
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || "An error occurred while changing password", "error");
    },
  });
};
