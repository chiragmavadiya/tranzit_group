import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api.constants';
import { showToast } from '@/components/ui/custom-toast';
import { trackingPageService } from '../services/tracking-page.service';
import type { TrackingPageSettingsUpdate } from '../types';

export const useTrackingPageSettings = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRACKING_PAGE_SETTINGS,
    queryFn: () => trackingPageService.getSettings(),
    enabled,
  });
};

export const useUpdateTrackingPageSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: TrackingPageSettingsUpdate) =>
      trackingPageService.updateSettings(update),
    onSuccess: (response) => {
      if (response.status) {
        showToast(response.message || 'Tracking page branding updated', 'success');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRACKING_PAGE_SETTINGS });
      } else {
        showToast(response.message || 'Failed to update tracking page branding', 'error');
      }
    },
    // The form keeps its values on failure; the shared client already surfaces the message.
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || 'An error occurred while saving branding',
        'error',
      );
    },
  });
};
