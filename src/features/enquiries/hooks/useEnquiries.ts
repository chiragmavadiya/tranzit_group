import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { enquiriesService } from '../services/enquiries.service';
import { showToast } from '@/components/ui/custom-toast';
import type { EnquiryStatus } from '../types';

export const useAdminInquiries = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['admin', 'inquiries', params],
    queryFn: () => enquiriesService.getAdminInquiries(params),
    placeholderData: keepPreviousData,
  });
};

export const useAdminInquiryDetails = (id: number | string) => {
  return useQuery({
    queryKey: ['admin', 'inquiries', 'details', id],
    queryFn: () => enquiriesService.getAdminInquiryDetails(id),
    enabled: !!id,
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: EnquiryStatus }) =>
      enquiriesService.updateInquiryStatus(id, status),
    onSuccess: (_, variables) => {
      showToast('Inquiry status updated successfully', "success");
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries', 'details', variables.id] });
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update status', "error");
    },
  });
};
