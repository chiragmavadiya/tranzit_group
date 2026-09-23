import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query';
import { enquiriesService } from '../services/enquiries.service';
import { showToast } from '@/components/ui/custom-toast';
import { QUERY_KEYS } from '@/constants/api.constants';
import { useQueryClient } from '@tanstack/react-query';

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => enquiriesService.createEnquiry(formData),
    onSuccess: () => {
      showToast('Your enquiry has been submitted successfully', "success");
      // invalid list query 
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.ENQUIRIES.LIST] });
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to submit enquiry', "error");
    },
  });
};

export const useCustomerEnquiries = (params: Record<string, any>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ENQUIRIES.LIST, params],
    queryFn: () => enquiriesService.getEnquiries(params),
    placeholderData: keepPreviousData,
  });
};
