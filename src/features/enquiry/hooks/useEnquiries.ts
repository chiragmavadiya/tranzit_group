import { useMutation } from '@tanstack/react-query';
import { enquiriesService } from '../services/enquiries.service';
import { showToast } from '@/components/ui/custom-toast';

export const useCreateEnquiry = () => {
  return useMutation({
    mutationFn: (formData: FormData) => enquiriesService.createEnquiry(formData),
    onSuccess: () => {
      showToast('Your enquiry has been submitted successfully', "success");
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to submit enquiry', "error");
    },
  });
};
