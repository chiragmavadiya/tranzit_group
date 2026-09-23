import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { UpdateProfileRequest, ChangePasswordRequest, ProfileResponse, GetProfileResponse } from "../types";

export const profileService = {
  getProfile: async (): Promise<GetProfileResponse> => {
    const response = await api.get<GetProfileResponse>(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ProfileResponse> => {
    const response = await api.post<ProfileResponse>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
    return response.data;
  },
};
