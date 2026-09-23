import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService, type AnnouncementPayload } from "../services/announcement.service";
import { QUERY_KEYS } from "@/constants/api.constants";
import { showToast } from "@/components/ui/custom-toast";

export function useAnnouncements(params?: { page?: number; per_page?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANNOUNCEMENTS.LIST, params],
    queryFn: () => announcementService.getAnnouncements(params),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AnnouncementPayload) => announcementService.createAnnouncement(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANNOUNCEMENTS.LIST });
      showToast(response.message || "Announcement created successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to create announcement", "error");
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: AnnouncementPayload }) =>
      announcementService.updateAnnouncement(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANNOUNCEMENTS.LIST });
      showToast(response.message || "Announcement updated successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to update announcement", "error");
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => announcementService.deleteAnnouncement(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANNOUNCEMENTS.LIST });
      showToast(response.message || "Announcement deleted successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to delete announcement", "error");
    },
  });
}

export function useToggleAnnouncementStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => announcementService.toggleStatus(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANNOUNCEMENTS.LIST });
      showToast(response.message || "Status updated successfully", "success");
    },
    onError: (error: any) => {
      showToast(error.message || "Failed to update status", "error");
    },
  });
}
