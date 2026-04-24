import { useMutation } from '@tanstack/react-query';
import { enquiriesService } from '../services/enquiries.service';
import { toast } from 'sonner';

export const useCreateEnquiry = () => {
  return useMutation({
    mutationFn: (formData: FormData) => enquiriesService.createEnquiry(formData),
    onSuccess: () => {
      toast.success('Your enquiry has been submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to submit enquiry');
    },
  });
};
