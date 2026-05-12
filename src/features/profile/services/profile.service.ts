import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { UpdateProfileRequest, ChangePasswordRequest, ProfileResponse } from "../types";

export const profileService = {
  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ProfileResponse> => {
    const response = await api.post<ProfileResponse>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
    return response.data;
  },
};
